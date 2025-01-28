package main

import (
	"fmt"
	"log"
	"net/http"
	"path/filepath"

	httpHandler "notes-app/backend/internal/delivery/http"
	"notes-app/backend/internal/delivery/http/middleware"
	noteHandler "notes-app/backend/internal/delivery/http/note"
	"notes-app/backend/internal/infrastructure/config"
	"notes-app/backend/internal/infrastructure/migration"
	"notes-app/backend/internal/infrastructure/repository/postgres"
	"notes-app/backend/internal/usecase/note"
	"notes-app/backend/internal/usecase/user"

	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// Load configuration
	cfg := config.LoadConfig()

	// Get absolute path to migrations directory
	migrationsPath, err := filepath.Abs("migrations")
	if err != nil {
		log.Fatalf("Failed to get migrations path: %v", err)
	}

	// Initialize migration runner
	runner, err := migration.NewRunner(migration.Config{
		DatabaseURL:    cfg.Database.URL(),
		MigrationsPath: migrationsPath,
	})
	if err != nil {
		log.Fatalf("Failed to create migration runner: %v", err)
	}
	defer runner.Close()

	// Run migrations
	if err := runner.Up(); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// Initialize database
	db, err := config.NewDatabase(cfg.Database)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()
	log.Printf("Database connected")

	// Initialize repositories
	userRepo := postgres.NewUserRepository(db)
	noteRepo := postgres.NewNoteRepository(db)
	log.Printf("Repositories initialized")

	// Initialize use cases
	userUseCase := user.NewUseCase(userRepo, user.Config{
		JWTSecret: cfg.JWT.Secret,
	})
	noteUseCase := note.NewUseCase(noteRepo)

	// Initialize handlers
	userHandler := httpHandler.NewUserHandler(userUseCase)
	noteHandler := noteHandler.NewHandler(noteUseCase, cfg.JWT.Secret)

	// Create router (using default mux for simplicity)
	mux := http.NewServeMux()

	// Set up routes
	mux.HandleFunc("/api/v1/auth/register", userHandler.Register)
	mux.HandleFunc("/api/v1/auth/login", userHandler.Login)
	noteHandler.Register(mux)

	// Create middleware chain
	handler := middleware.CORSMiddleware(cfg.Server.AllowedOrigins)(mux)

	// Start the server
	serverAddr := fmt.Sprintf(":%d", cfg.Server.Port)
	log.Printf("Server starting on %s", serverAddr)
	if err := http.ListenAndServe(serverAddr, handler); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

package main

import (
	"fmt"
	"log"
	"net/http"

	httpHandler "notes-app/backend/internal/delivery/http"
	"notes-app/backend/internal/delivery/http/middleware"
	"notes-app/backend/internal/infrastructure/config"
	"notes-app/backend/internal/infrastructure/repository/postgres"
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

	// Debug: Print database configuration
	log.Printf("Database Config - Host: %s, Port: %d, User: %s, DBName: %s\n",
		cfg.Database.Host, cfg.Database.Port, cfg.Database.User, cfg.Database.DBName)

	// Initialize database
	db, err := config.NewDatabase(cfg.Database)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()
	log.Printf("Database connected")
	// Initialize repository
	userRepo := postgres.NewUserRepository(db)
	log.Printf("User repository initialized")
	// Initialize use case
	userUseCase := user.NewUseCase(userRepo, user.Config{
		JWTSecret: cfg.JWT.Secret,
	})

	// Initialize handler
	userHandler := httpHandler.NewUserHandler(userUseCase)

	// Create router (using default mux for simplicity)
	mux := http.NewServeMux()

	// Set up routes
	mux.HandleFunc("/api/v1/auth/register", userHandler.Register)
	mux.HandleFunc("/api/v1/auth/login", userHandler.Login)

	// Create middleware chain
	handler := middleware.CORSMiddleware(cfg.Server.AllowedOrigins)(mux)

	// Start the server
	serverAddr := fmt.Sprintf(":%d", cfg.Server.Port)
	log.Printf("Server starting on %s", serverAddr)
	if err := http.ListenAndServe(serverAddr, handler); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

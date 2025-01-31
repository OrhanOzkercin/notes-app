package main

import (
	"flag"
	"fmt"
	"log"
	"notes-app/backend/internal/infrastructure/migration"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	// Parse command line flags
	down := flag.Bool("down", false, "Run down migrations")
	version := flag.Bool("version", false, "Get current migration version")
	force := flag.Int("force", -1, "Force version to specific number")
	flag.Parse()

	// Construct database URL from environment variables
	dbURL := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)

	// Create migration config
	config := migration.Config{
		DatabaseURL:    dbURL,
		MigrationsPath: "migrations", // relative to the project root
	}

	// Create migration runner
	runner, err := migration.NewRunner(config)
	if err != nil {
		log.Fatalf("Failed to create migration runner: %v", err)
	}
	defer runner.Close()

	// Handle force version
	if *force >= 0 {
		if err := runner.Force(*force); err != nil {
			log.Fatalf("Failed to force version: %v", err)
		}
		fmt.Printf("Successfully forced version to %d\n", *force)
		return
	}

	// Handle different commands
	if *version {
		// Get current version
		ver, dirty, err := runner.Version()
		if err != nil {
			log.Fatalf("Failed to get version: %v", err)
		}
		fmt.Printf("Current migration version: %d (dirty: %v)\n", ver, dirty)
		return
	}

	if *down {
		// Run down migrations
		if err := runner.Down(); err != nil {
			log.Fatalf("Failed to run down migrations: %v", err)
		}
		fmt.Println("Successfully ran down migrations")
		return
	}

	// Default: run up migrations
	if err := runner.Up(); err != nil {
		log.Fatalf("Failed to run up migrations: %v", err)
	}
	fmt.Println("Successfully ran up migrations")
}

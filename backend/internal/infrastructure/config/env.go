package config

import (
	"fmt"
	"os"
	"strconv"
)

// AppConfig holds all application configuration
type AppConfig struct {
	Database DatabaseConfig
	Server   ServerConfig
	JWT      JWTConfig
}

// ServerConfig holds server-related configuration
type ServerConfig struct {
	Port int
	// Add allowed origins for CORS (your Next.js frontend URL)
	AllowedOrigins []string
}

// JWTConfig holds JWT-related configuration
type JWTConfig struct {
	Secret string
}

// LoadConfig loads configuration from environment variables
func LoadConfig() AppConfig {
	// Debug: Print all environment variables
	fmt.Printf("Loading environment variables:\n")
	fmt.Printf("DB_USER=%s\n", os.Getenv("DB_USER"))
	fmt.Printf("DB_HOST=%s\n", os.Getenv("DB_HOST"))
	fmt.Printf("DB_PORT=%s\n", os.Getenv("DB_PORT"))
	fmt.Printf("DB_NAME=%s\n", os.Getenv("DB_NAME"))

	return AppConfig{
		Database: DatabaseConfig{
			Host:     getEnvOrDefault("DB_HOST", "localhost"),
			Port:     getEnvAsIntOrDefault("DB_PORT", 5432),
			User:     getEnvOrDefault("DB_USER", "postgres"),
			Password: getEnvOrDefault("DB_PASSWORD", "postgres"),
			DBName:   getEnvOrDefault("DB_NAME", "notes_app"),
		},
		Server: ServerConfig{
			Port: getEnvAsIntOrDefault("SERVER_PORT", 8080),
			AllowedOrigins: []string{
				getEnvOrDefault("FRONTEND_URL", "http://localhost:3000"),
			},
		},
		JWT: JWTConfig{
			Secret: getEnvOrDefault("JWT_SECRET", "your-secret-key"),
		},
	}
}

// Helper functions to get environment variables with defaults
func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	fmt.Printf("Warning: Using default value for %s: %s\n", key, defaultValue)
	return defaultValue
}

func getEnvAsIntOrDefault(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
		fmt.Printf("Warning: Could not parse %s value: %s\n", key, value)
	}
	fmt.Printf("Warning: Using default value for %s: %d\n", key, defaultValue)
	return defaultValue
} 
package config

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
)

// DatabaseConfig holds all database configuration
type DatabaseConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	DBName   string
}

// NewDatabase creates a new database connection
func NewDatabase(config DatabaseConfig) (*sql.DB, error) {
	// Create connection string with all necessary parameters
	dsn := fmt.Sprintf(
		"postgresql://%s:%s@%s:%d/%s?sslmode=disable",
		config.User, config.Password, config.Host, config.Port, config.DBName,
	)

	// Debug connection string (without password)
	debugDsn := fmt.Sprintf(
		"postgresql://%s:****@%s:%d/%s?sslmode=disable",
		config.User, config.Host, config.Port, config.DBName,
	)
	fmt.Printf("Attempting to connect with: %s\n", debugDsn)

	// Open connection
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, fmt.Errorf("error opening database: %w", err)
	}

	// Configure connection pool
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)

	// Test connection
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("error connecting to the database: %w", err)
	}

	return db, nil
} 
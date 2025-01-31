package migration

import (
	"fmt"
	"log"

	"github.com/golang-migrate/migrate/v4"
	// We need both postgres and file drivers
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

// Config holds the configuration for migrations
type Config struct {
	DatabaseURL    string // PostgreSQL connection URL
	MigrationsPath string // Path to migration files
}

// Runner handles database migrations
type Runner struct {
	migrate *migrate.Migrate
}

// NewRunner creates a new migration runner
func NewRunner(config Config) (*Runner, error) {
	// Create a new migrate instance
	m, err := migrate.New(
		fmt.Sprintf("file://%s", config.MigrationsPath), // Source URL (local files)
		config.DatabaseURL, // Database URL
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create migration instance: %w", err)
	}

	return &Runner{migrate: m}, nil
}

// Up runs all available migrations
func (r *Runner) Up() error {
	if err := r.migrate.Up(); err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("failed to run migrations: %w", err)
	}
	log.Println("Migrations completed successfully")
	return nil
}

// Down rolls back all migrations
func (r *Runner) Down() error {
	if err := r.migrate.Down(); err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("failed to rollback migrations: %w", err)
	}
	log.Println("Rollback completed successfully")
	return nil
}

// Version returns the current migration version
func (r *Runner) Version() (uint, bool, error) {
	return r.migrate.Version()
}

// Force sets a version without running migrations
func (r *Runner) Force(version int) error {
	if err := r.migrate.Force(version); err != nil {
		return fmt.Errorf("failed to force version: %w", err)
	}
	return nil
}

// Close closes the migration runner
func (r *Runner) Close() error {
	srcErr, dbErr := r.migrate.Close()
	if srcErr != nil {
		return fmt.Errorf("failed to close source: %w", srcErr)
	}
	if dbErr != nil {
		return fmt.Errorf("failed to close database: %w", dbErr)
	}
	return nil
}

package postgres

import (
	"context"
	"database/sql"
	"errors"
	"log"

	domainUser "notes-app/backend/internal/domain/user"

	_ "github.com/lib/pq"
)

// Repository implements the domain.Repository interface for PostgreSQL
type userRepository struct {
	db *sql.DB
}

// NewUserRepository creates a new PostgreSQL user repository
func NewUserRepository(db *sql.DB) domainUser.Repository {
	return &userRepository{
		db: db,
	}
}

// Create stores a new user in the database
func (r *userRepository) Create(ctx context.Context, user *domainUser.User) error {
	query := `
		INSERT INTO users (id, email, password, created_at)
		VALUES ($1, $2, $3, $4)
	`

	_, err := r.db.ExecContext(ctx, query,
		user.ID,
		user.Email,
		user.Password,
		user.CreatedAt,
	)

	return err
}

// GetByID retrieves a user by their ID
func (r *userRepository) GetByID(ctx context.Context, id string) (*domainUser.User, error) {
	query := `
		SELECT id, email, password, created_at
		FROM users
		WHERE id = $1
	`

	user := &domainUser.User{}
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&user.ID,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}

	if err != nil {
		return nil, err
	}

	return user, nil
}

// GetByEmail retrieves a user by their email
func (r *userRepository) GetByEmail(ctx context.Context, email string) (*domainUser.User, error) {
	query := `
		SELECT id, email, password, created_at
		FROM users
		WHERE email = $1
	`

	user := &domainUser.User{}
	err := r.db.QueryRowContext(ctx, query, email).Scan(
		&user.ID,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
	)

	log.Println("GetByEmail -> user:", user)

	if err == sql.ErrNoRows {
		return nil, nil
	}

	if err != nil {
		return nil, err
	}

	return user, nil
}

// Update modifies an existing user
func (r *userRepository) Update(ctx context.Context, user *domainUser.User) error {
	query := `
		UPDATE users
		SET email = $2, password = $3
		WHERE id = $1
	`

	result, err := r.db.ExecContext(ctx, query,
		user.ID,
		user.Email,
		user.Password,
	)

	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("user not found")
	}

	return nil
}

// Delete removes a user from the database
func (r *userRepository) Delete(ctx context.Context, id string) error {
	query := `
		DELETE FROM users
		WHERE id = $1
	`

	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("user not found")
	}

	return nil
}

package user

import "context"

// Repository defines the interface for user data operations
type Repository interface {
	// Create stores a new user
	Create(ctx context.Context, user *User) error
	
	// GetByID retrieves a user by their ID
	GetByID(ctx context.Context, id string) (*User, error)
	
	// GetByEmail retrieves a user by their email
	GetByEmail(ctx context.Context, email string) (*User, error)
	
	// Update modifies an existing user
	Update(ctx context.Context, user *User) error
	
	// Delete removes a user
	Delete(ctx context.Context, id string) error
} 
package note

import (
	"context"
)

// Repository defines the interface for note persistence operations
type Repository interface {
	// Create stores a new note in the database
	Create(ctx context.Context, note *Note) error

	// GetByID retrieves a note by its ID
	GetByID(ctx context.Context, id string) (*Note, error)

	// ListByUserID retrieves all notes for a given user
	ListByUserID(ctx context.Context, userID string) ([]*Note, error)

	// Update modifies an existing note
	Update(ctx context.Context, note *Note) error

	// Delete removes a note from the database
	Delete(ctx context.Context, id string) error
}

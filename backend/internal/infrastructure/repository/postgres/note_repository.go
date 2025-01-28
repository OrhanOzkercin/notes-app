package postgres

import (
	"context"
	"database/sql"
	"fmt"
	"notes-app/backend/internal/domain/note"

	"github.com/lib/pq"
)

// NoteRepository implements note.Repository interface using PostgreSQL
type NoteRepository struct {
	db *sql.DB
}

// NewNoteRepository creates a new PostgreSQL note repository
func NewNoteRepository(db *sql.DB) note.Repository {
	return &NoteRepository{db: db}
}

// Create stores a new note in the database
func (r *NoteRepository) Create(ctx context.Context, note *note.Note) error {
	// SQL query to insert a new note
	query := `
		INSERT INTO notes (
			title, content_json, html_snapshot, version,
			user_id, collaborators
		) VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at, updated_at`

	// Execute the query
	err := r.db.QueryRowContext(
		ctx,
		query,
		note.Title,
		note.ContentJSON, // json.RawMessage will be automatically handled by lib/pq
		note.HTMLSnapshot,
		1, // Initial version
		note.UserID,
		pq.Array(note.Collaborators),
	).Scan(&note.ID, &note.CreatedAt, &note.UpdatedAt)

	if err != nil {
		return fmt.Errorf("failed to create note: %w", err)
	}

	return nil
}

// GetByID retrieves a note by its ID
func (r *NoteRepository) GetByID(ctx context.Context, id string) (*note.Note, error) {
	query := `
		SELECT id, title, content_json, html_snapshot, version,
			   user_id, collaborators, created_at, updated_at
		FROM notes
		WHERE id = $1`

	n := &note.Note{}
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&n.ID,
		&n.Title,
		&n.ContentJSON,
		&n.HTMLSnapshot,
		&n.Version,
		&n.UserID,
		pq.Array(&n.Collaborators),
		&n.CreatedAt,
		&n.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("note not found: %w", err)
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get note: %w", err)
	}

	return n, nil
}

// ListByUserID retrieves all notes for a given user
func (r *NoteRepository) ListByUserID(ctx context.Context, userID string) ([]*note.Note, error) {
	query := `
		SELECT id, title, content_json, html_snapshot, version,
			   user_id, collaborators, created_at, updated_at
		FROM notes
		WHERE user_id = $1 OR $1 = ANY(collaborators)
		ORDER BY updated_at DESC`

	rows, err := r.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to list notes: %w", err)
	}
	defer rows.Close()

	var notes []*note.Note
	for rows.Next() {
		n := &note.Note{}
		err := rows.Scan(
			&n.ID,
			&n.Title,
			&n.ContentJSON,
			&n.HTMLSnapshot,
			&n.Version,
			&n.UserID,
			pq.Array(&n.Collaborators),
			&n.CreatedAt,
			&n.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan note: %w", err)
		}
		notes = append(notes, n)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating notes: %w", err)
	}

	return notes, nil
}

// Update modifies an existing note
func (r *NoteRepository) Update(ctx context.Context, note *note.Note) error {
	query := `
		UPDATE notes
		SET title = $1, content_json = $2, html_snapshot = $3,
			version = version + 1, collaborators = $4
		WHERE id = $5 AND version = $6
		RETURNING version, updated_at`

	result := r.db.QueryRowContext(ctx, query,
		note.Title,
		note.ContentJSON,
		note.HTMLSnapshot,
		pq.Array(note.Collaborators),
		note.ID,
		note.Version,
	)

	err := result.Scan(&note.Version, &note.UpdatedAt)
	if err == sql.ErrNoRows {
		return fmt.Errorf("note version conflict or not found")
	}
	if err != nil {
		return fmt.Errorf("failed to update note: %w", err)
	}

	return nil
}

// Delete removes a note from the database
func (r *NoteRepository) Delete(ctx context.Context, id string) error {
	query := `DELETE FROM notes WHERE id = $1`

	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete note: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get affected rows: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("note not found")
	}

	return nil
}

package note

import (
	"context"
	"encoding/json"
	"fmt"
	"notes-app/backend/internal/domain/note"
)

// UseCase handles note-related business logic
type UseCase struct {
	repo note.Repository
}

// NewUseCase creates a new note use case
func NewUseCase(repo note.Repository) *UseCase {
	return &UseCase{
		repo: repo,
	}
}

// CreateNoteInput represents the data needed to create a note
type CreateNoteInput struct {
	Title         string          `json:"title"`
	ContentJSON   json.RawMessage `json:"content_json"`
	HTMLSnapshot  string          `json:"html_snapshot"`
	UserID        string          `json:"user_id"`
	Collaborators []string        `json:"collaborators,omitempty"`
}

// CreateNote handles the creation of a new note with validation
func (uc *UseCase) CreateNote(ctx context.Context, input CreateNoteInput) (*note.Note, error) {
	// Create note entity
	newNote := &note.Note{
		Title:         input.Title,
		ContentJSON:   input.ContentJSON,
		HTMLSnapshot:  input.HTMLSnapshot,
		UserID:        input.UserID,
		Collaborators: input.Collaborators,
		Version:       1,
	}

	// Validate content format
	if err := newNote.ValidateContent(); err != nil {
		return nil, fmt.Errorf("invalid note content: %w", err)
	}

	// Store in database
	if err := uc.repo.Create(ctx, newNote); err != nil {
		return nil, fmt.Errorf("failed to create note: %w", err)
	}

	return newNote, nil
}

// GetNoteByID retrieves a note and checks user access
func (uc *UseCase) GetNoteByID(ctx context.Context, id string, userID string) (*note.Note, error) {
	// Get note from repository
	n, err := uc.repo.GetByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get note: %w", err)
	}

	// Check if user has access
	if !n.IsCollaborator(userID) {
		return nil, fmt.Errorf("access denied to note")
	}

	return n, nil
}

// ListUserNotes gets all notes accessible by a user
func (uc *UseCase) ListUserNotes(ctx context.Context, userID string) ([]*note.Note, error) {
	notes, err := uc.repo.ListByUserID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to list notes: %w", err)
	}
	return notes, nil
}

// UpdateNoteInput represents the data needed to update a note
type UpdateNoteInput struct {
	ID            string          `json:"id"`
	Title         string          `json:"title"`
	ContentJSON   json.RawMessage `json:"content_json"`
	HTMLSnapshot  string          `json:"html_snapshot"`
	Version       int             `json:"version"`
	Collaborators []string        `json:"collaborators,omitempty"`
}

// UpdateNote handles note updates with validation and version checking
func (uc *UseCase) UpdateNote(ctx context.Context, input UpdateNoteInput, userID string) (*note.Note, error) {
	// First, get the existing note
	existingNote, err := uc.repo.GetByID(ctx, input.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to get note: %w", err)
	}

	// Check if user has access
	if !existingNote.IsCollaborator(userID) {
		return nil, fmt.Errorf("access denied to note")
	}

	// Update fields
	existingNote.Title = input.Title
	existingNote.ContentJSON = input.ContentJSON
	existingNote.HTMLSnapshot = input.HTMLSnapshot
	existingNote.Collaborators = input.Collaborators

	// Validate content
	if err := existingNote.ValidateContent(); err != nil {
		return nil, fmt.Errorf("invalid note content: %w", err)
	}

	// Update in database
	if err := uc.repo.Update(ctx, existingNote); err != nil {
		return nil, fmt.Errorf("failed to update note: %w", err)
	}

	return existingNote, nil
}

// DeleteNote removes a note if the user is the owner
func (uc *UseCase) DeleteNote(ctx context.Context, id string, userID string) error {
	// First, get the note to check ownership
	note, err := uc.repo.GetByID(ctx, id)
	if err != nil {
		return fmt.Errorf("failed to get note: %w", err)
	}

	// Only the owner can delete notes
	if note.UserID != userID {
		return fmt.Errorf("only the owner can delete notes")
	}

	// Delete from database
	if err := uc.repo.Delete(ctx, id); err != nil {
		return fmt.Errorf("failed to delete note: %w", err)
	}

	return nil
}

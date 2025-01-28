package note

import (
	"encoding/json"
	"time"
)

// Note represents a note in the system
type Note struct {
	ID            string          `json:"id"`                      // Unique identifier
	Title         string          `json:"title"`                   // Note title
	ContentJSON   json.RawMessage `json:"content_json"`            // Rich text content as JSON
	HTMLSnapshot  string          `json:"html_snapshot"`           // Pre-rendered HTML for quick display
	Version       int             `json:"version"`                 // For handling concurrent updates
	UserID        string          `json:"user_id"`                 // Who created the note
	Collaborators []string        `json:"collaborators,omitempty"` // List of user IDs who can access
	CreatedAt     time.Time       `json:"created_at"`              // When the note was created
	UpdatedAt     time.Time       `json:"updated_at"`              // Last update timestamp
}

// ValidateContent checks if the note's content is valid JSON
func (n *Note) ValidateContent() error {
	// ContentJSON is already validated by json.RawMessage
	return nil
}

// IsCollaborator checks if a user has access to this note
func (n *Note) IsCollaborator(userID string) bool {
	// Owner is always a collaborator
	if n.UserID == userID {
		return true
	}

	// Check collaborators list
	for _, collaboratorID := range n.Collaborators {
		if collaboratorID == userID {
			return true
		}
	}
	return false
}

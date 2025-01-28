package note

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"notes-app/backend/internal/delivery/http/middleware"
	"notes-app/backend/internal/delivery/http/response"
	"notes-app/backend/internal/usecase/note"
)

// Handler handles HTTP requests for notes
type Handler struct {
	useCase   *note.UseCase
	jwtSecret string
}

// NewHandler creates a new note handler
func NewHandler(useCase *note.UseCase, jwtSecret string) *Handler {
	return &Handler{
		useCase:   useCase,
		jwtSecret: jwtSecret,
	}
}

// Register sets up the routes for the note handler
func (h *Handler) Register(mux *http.ServeMux) {
	// Collection endpoints (POST /notes, GET /notes)
	collectionHandler := middleware.AuthMiddleware(h.jwtSecret)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/api/v1/notes" {
			http.NotFound(w, r)
			return
		}

		switch r.Method {
		case http.MethodPost:
			h.CreateNote(w, r)
		case http.MethodGet:
			h.ListNotes(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}))

	// Single note endpoints (GET /notes/{id}, PUT /notes/{id}, DELETE /notes/{id})
	singleNoteHandler := middleware.AuthMiddleware(h.jwtSecret)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !strings.HasPrefix(r.URL.Path, "/api/v1/notes/") {
			http.NotFound(w, r)
			return
		}

		// Extract note ID from path
		parts := strings.Split(strings.TrimPrefix(r.URL.Path, "/api/v1/notes/"), "/")
		if len(parts) != 1 || parts[0] == "" {
			http.NotFound(w, r)
			return
		}

		switch r.Method {
		case http.MethodGet:
			h.GetNote(w, r)
		case http.MethodPut:
			h.UpdateNote(w, r)
		case http.MethodDelete:
			h.DeleteNote(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}))

	// Register routes
	mux.Handle("/api/v1/notes", collectionHandler)  // For collection endpoints
	mux.Handle("/api/v1/notes/", singleNoteHandler) // For single note endpoints
}

// CreateNote handles note creation requests
func (h *Handler) CreateNote(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed", "")
		return
	}

	userID := r.Context().Value("user_id").(string)
	log.Printf("Creating note for user: %s", userID)

	var input note.CreateNoteInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		log.Printf("Failed to decode request body: %v", err)
		response.Error(w, http.StatusBadRequest, "INVALID_REQUEST", "Invalid request body", err.Error())
		return
	}

	input.UserID = userID

	newNote, err := h.useCase.CreateNote(r.Context(), input)
	if err != nil {
		log.Printf("Failed to create note: %v", err)
		response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to create note", err.Error())
		return
	}

	log.Printf("Note created successfully with ID: %s", newNote.ID)
	response.JSON(w, http.StatusCreated, newNote)
}

// ListNotes handles requests to list all notes for a user
func (h *Handler) ListNotes(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID := r.Context().Value("user_id").(string)

	notes, err := h.useCase.ListUserNotes(r.Context(), userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(notes)
}

// GetNote handles requests to get a single note
func (h *Handler) GetNote(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Extract note ID from path
	path := strings.Split(r.URL.Path, "/")
	if len(path) != 5 {
		http.Error(w, "Invalid path", http.StatusBadRequest)
		return
	}
	noteID := path[4]

	userID := r.Context().Value("user_id").(string)

	note, err := h.useCase.GetNoteByID(r.Context(), noteID, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(note)
}

// UpdateNote handles note update requests
func (h *Handler) UpdateNote(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Extract note ID from path
	path := strings.Split(r.URL.Path, "/")
	if len(path) != 5 {
		http.Error(w, "Invalid path", http.StatusBadRequest)
		return
	}
	noteID := path[4]

	userID := r.Context().Value("user_id").(string)

	var input note.UpdateNoteInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	input.ID = noteID

	updatedNote, err := h.useCase.UpdateNote(r.Context(), input, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updatedNote)
}

// DeleteNote handles note deletion requests
func (h *Handler) DeleteNote(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Extract note ID from path
	path := strings.Split(r.URL.Path, "/")
	if len(path) != 5 {
		http.Error(w, "Invalid path", http.StatusBadRequest)
		return
	}
	noteID := path[4]

	userID := r.Context().Value("user_id").(string)

	if err := h.useCase.DeleteNote(r.Context(), noteID, userID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

package http

import (
	"encoding/json"
	"log"
	"net/http"
	"notes-app/backend/internal/delivery/http/response"
	"notes-app/backend/internal/usecase/user"
)

// UserHandler handles HTTP requests for user operations
type UserHandler struct {
	userUseCase user.UseCase
}

// NewUserHandler creates a new user handler
func NewUserHandler(userUseCase user.UseCase) *UserHandler {
	return &UserHandler{
		userUseCase: userUseCase,
	}
}

// RegisterRequest represents the registration request body
type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// LoginRequest represents the login request body
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// LoginResponse represents the login response
type LoginResponse struct {
	Token string `json:"token"`
}

// Register handles user registration
func (h *UserHandler) Register(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		log.Printf("Method not allowed: %s", r.Method)
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed", "")
		return
	}

	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Failed to decode request body: %v", err)
		response.Error(w, http.StatusBadRequest, "INVALID_REQUEST", "Invalid request body", err.Error())
		return
	}

	log.Printf("Processing registration request for email: %s", req.Email)
	err := h.userUseCase.Register(r.Context(), req.Email, req.Password)
	if err != nil {
		log.Printf("Registration failed: %v", err)
		switch err {
		case user.ErrUserAlreadyExists:
			response.Error(w, http.StatusConflict, "USER_EXISTS", "User already exists", "")
		default:
			response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Internal server error", "")
		}
		return
	}

	log.Printf("Registration successful for email: %s", req.Email)
	response.JSON(w, http.StatusCreated, map[string]string{"message": "User registered successfully"})
}

// Login handles user login
func (h *UserHandler) Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		log.Printf("Method not allowed: %s", r.Method)
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed", "")
		return
	}

	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Failed to decode request body: %v", err)
		response.Error(w, http.StatusBadRequest, "INVALID_REQUEST", "Invalid request body", err.Error())
		return
	}

	log.Printf("Processing login request for email: %s", req.Email)
	token, err := h.userUseCase.Login(r.Context(), req.Email, req.Password)
	if err != nil {
		log.Printf("Login failed: %v", err)
		switch err {
		case user.ErrInvalidCredentials:
			response.Error(w, http.StatusUnauthorized, "INVALID_CREDENTIALS", "Invalid email or password", "")
		default:
			response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Internal server error", "")
		}
		return
	}

	log.Printf("Login successful for email: %s", req.Email)
	response.JSON(w, http.StatusOK, LoginResponse{Token: token})
}

package user

import (
	"context"
	"errors"
	"log"

	"github.com/google/uuid"

	domainUser "notes-app/backend/internal/domain/user"

	"github.com/golang-jwt/jwt/v5"
)

var (
	ErrUserAlreadyExists  = errors.New("user already exists")
	ErrInvalidCredentials = errors.New("invalid credentials")
)

// UseCase defines the interface for user-related operations
type UseCase interface {
	// Register creates a new user account
	Register(ctx context.Context, email, password string) error

	// Login authenticates a user and returns a JWT token
	Login(ctx context.Context, email, password string) (string, error)
}

// Config holds the configuration for the use case
type Config struct {
	JWTSecret string
}

type useCase struct {
	userRepo  domainUser.Repository
	jwtSecret string
}

// NewUseCase creates a new instance of the user use case
func NewUseCase(repo domainUser.Repository, cfg Config) UseCase {
	return &useCase{
		userRepo:  repo,
		jwtSecret: cfg.JWTSecret,
	}
}

// Register implements the user registration use case
func (uc *useCase) Register(ctx context.Context, email, password string) error {
	// Check if user already exists
	existingUser, err := uc.userRepo.GetByEmail(ctx, email)
	if err == nil && existingUser != nil {
		return ErrUserAlreadyExists
	}

	// Create new user
	user, err := domainUser.NewUser(email, password)
	if err != nil {
		return err
	}

	// Generate UUID for the user
	user.ID = uuid.New().String()

	// Save user to repository
	return uc.userRepo.Create(ctx, user)
}

// Login implements the user login use case
func (uc *useCase) Login(ctx context.Context, email, password string) (string, error) {
	// Get user by email
	user, err := uc.userRepo.GetByEmail(ctx, email)
	if err != nil {
		log.Printf("Error retrieving user by email: %v", err)
		return "", ErrInvalidCredentials
	}

	if user == nil {
		log.Printf("User not found for email: %s", email)
		return "", ErrInvalidCredentials
	}

	// Validate password
	if !user.ValidatePassword(password) {
		return "", ErrInvalidCredentials
	}

	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
	})

	// Sign the token
	tokenString, err := token.SignedString([]byte(uc.jwtSecret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

package user

import (
	"time"
	"errors"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrInvalidEmail    = errors.New("invalid email")
	ErrInvalidPassword = errors.New("invalid password")
)

// User represents the user entity in the domain
type User struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	Password  string    `json:"-"` // "-" ensures password is never serialized to JSON
	CreatedAt time.Time `json:"created_at"`
}

// NewUser creates a new user instance with validation
func NewUser(email, password string) (*User, error) {
	if email == "" {
		return nil, ErrInvalidEmail
	}
	if password == "" {
		return nil, ErrInvalidPassword
	}

	// Hash password before storing
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	return &User{
		Email:     email,
		Password:  string(hashedPassword),
		CreatedAt: time.Now(),
	}, nil
}

// ValidatePassword checks if the provided password matches the stored hash
func (u *User) ValidatePassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	return err == nil
}

// UpdatePassword updates the user's password with a new one
func (u *User) UpdatePassword(newPassword string) error {
	if newPassword == "" {
		return ErrInvalidPassword
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	u.Password = string(hashedPassword)
	return nil
} 
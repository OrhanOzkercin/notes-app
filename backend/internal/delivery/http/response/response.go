package response

import (
	"encoding/json"
	"net/http"
	"time"
)

// SuccessResponse represents a successful API response
type SuccessResponse struct {
	Data      interface{} `json:"data"`
	Meta      *Meta       `json:"meta,omitempty"`
	RequestID string      `json:"requestId"`
	Timestamp time.Time   `json:"timestamp"`
}

// ErrorResponse represents an error API response
type ErrorResponse struct {
	Errors    []APIError `json:"errors"`
	RequestID string     `json:"requestId"`
	Timestamp time.Time  `json:"timestamp"`
}

// APIError represents a single error
type APIError struct {
	Code    string     `json:"code"`
	Message string     `json:"message"`
	Target  string     `json:"target,omitempty"`  // Field/resource causing the error
	Details []APIError `json:"details,omitempty"` // Nested errors
	DocURL  string     `json:"docUrl,omitempty"`  // Link to error documentation
}

// Meta contains metadata about the response
type Meta struct {
	Total   int `json:"total,omitempty"`
	Page    int `json:"page,omitempty"`
	PerPage int `json:"perPage,omitempty"`
}

// JSON sends a successful JSON response
func JSON(w http.ResponseWriter, statusCode int, data interface{}) {
	response := SuccessResponse{
		Data:      data,
		RequestID: generateRequestID(), // You'll need to implement this
		Timestamp: time.Now().UTC(),
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(response)
}

// Error sends a JSON error response
func Error(w http.ResponseWriter, statusCode int, code string, message string, target string) {
	response := ErrorResponse{
		Errors: []APIError{
			{
				Code:    code,
				Message: message,
				Target:  target,
				DocURL:  getErrorDocURL(code), // You'll need to implement this
			},
		},
		RequestID: generateRequestID(), // You'll need to implement this
		Timestamp: time.Now().UTC(),
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(response)
}

// ErrorWithDetails sends a JSON error response with nested errors
func ErrorWithDetails(w http.ResponseWriter, statusCode int, code string, message string, details []APIError) {
	response := ErrorResponse{
		Errors: []APIError{
			{
				Code:    code,
				Message: message,
				Details: details,
				DocURL:  getErrorDocURL(code), // You'll need to implement this
			},
		},
		RequestID: generateRequestID(), // You'll need to implement this
		Timestamp: time.Now().UTC(),
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(response)
}

// Helper functions to implement
func generateRequestID() string {
	// TODO: Implement request ID generation
	// Use UUID v4 or similar
	return "temp-id"
}

func getErrorDocURL(code string) string {
	// TODO: Implement mapping error codes to documentation URLs
	return ""
}

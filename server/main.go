package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/rs/cors"
)

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Level    string `json:"level"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Username string `json:"username,omitempty"`
	Level    string `json:"level,omitempty"`
	Error    string `json:"error,omitempty"`
}

func loadUsers() ([]User, error) {
	file, err := os.Open("users.json")
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var users []User
	err = json.NewDecoder(file).Decode(&users)
	return users, err
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	users, err := loadUsers()
	if err != nil {
		http.Error(w, "Failed to load users", http.StatusInternalServerError)
		return
	}

	for _, user := range users {
		if user.Username == req.Username && user.Password == req.Password {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(LoginResponse{
				Username: user.Username,
				Level:    user.Level,
			})
			return
		}
	}

	w.WriteHeader(http.StatusUnauthorized)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(LoginResponse{
		Error: "Invalid credentials",
	})
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/login", loginHandler)

	handler := cors.AllowAll().Handler(mux)

	fmt.Println("Server listening on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8081", handler))
}

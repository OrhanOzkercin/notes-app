# Notes App

A collaborative rich-text note-taking platform with version history and real-time previews.

## Project Structure

```
.
├── frontend/          # Next.js frontend application
└── backend/           # Go backend API
```

## Prerequisites

- Node.js 18+ and npm
- Go 1.21+
- PostgreSQL 15+

## Getting Started

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd notes-app
   ```

2. Set up the backend:
   ```bash
   cd backend
   cp .env.example .env    # Copy and modify with your values
   go mod download
   go run cmd/api/main.go
   ```

3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Visit `http://localhost:3000` in your browser

## Environment Variables

### Backend (.env)
Copy `.env.example` to `.env` and update the values:
- `DB_HOST`: PostgreSQL host
- `DB_PORT`: PostgreSQL port
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `SERVER_PORT`: API server port
- `JWT_SECRET`: Secret key for JWT tokens
- `FRONTEND_URL`: Frontend application URL

## Features

- Rich text editing with Quill
- User authentication with JWT
- Real-time collaboration (coming soon)
- Version history
- Markdown shortcuts
- Content sanitization

## Tech Stack

### Frontend
- Next.js 15 with App Router
- TanStack Query for data fetching
- Shadcn UI components
- Tailwind CSS

### Backend
- Go with Clean Architecture
- PostgreSQL database
- JWT authentication

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details 
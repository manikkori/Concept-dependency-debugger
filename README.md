# Concept Dependency Debugger

Concept Dependency Debugger is a full-stack learning diagnostic app. A student takes a subject quiz, then the app evaluates each concept in its prerequisite graph to identify the earliest weak foundation - the root cause - rather than treating every missed advanced question as an independent gap.

The graph makes the diagnosis easy to interpret:

- **Root cause:** a thick, solid red node with a `ROOT CAUSE` badge.
- **Affected:** a dashed red node for a downstream weak concept affected by the learning gap.
- **Borderline:** a yellow node for an adjusted score from 0.60 to 0.79.
- **Strong:** a green node for an adjusted score of 0.80 or higher.

## Tech stack

- **Frontend:** React 19, Vite, Tailwind CSS, React Flow, Lucide React
- **Backend:** Node.js, Express, CORS, dotenv
- **AI explanation:** Groq's OpenAI-compatible API via the official `openai` Node SDK
- **Data:** local JSON concept-dependency graphs and question banks for Discrete Math, Computer Networks, DBMS, Data Structures, OOP Concepts, and Web Dev Basics

## Prerequisites

Install a current Node.js LTS release (Node 20+ recommended) and npm. A Groq API key is optional: the diagnosis endpoint still returns a fallback explanation if one is not configured, but AI-generated explanations require it.

## Environment variables

Create `backend/.env` with the following value when AI explanations are desired:

```env
GROQ_API_KEY=your_groq_api_key
```

The frontend can use this optional variable in `frontend/.env` when the API is hosted somewhere other than the local backend:

```env
VITE_API_BASE_URL=http://localhost:5000
```

If `VITE_API_BASE_URL` is omitted, the frontend defaults to `http://localhost:5000`.

## Setup and run

1. Clone the repository and enter the project directory.

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install backend dependencies.

   ```bash
   cd backend
   npm install
   ```

3. Create `backend/.env` and add `GROQ_API_KEY` if you want AI-generated explanations.

4. Start the backend from the `backend` directory.

   ```bash
   node src/index.js
   ```

   The API listens on `http://localhost:5000` by default. Set `PORT` in `backend/.env` to use another port.

5. In a second terminal, install and start the frontend.

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

6. Open the local URL printed by Vite (normally `http://localhost:5173`), choose a subject, and start an assessment.

## Available API endpoints

- `GET /` - backend health message
- `GET /api/quiz?subject=<subject>` - graph and question data for a subject
- `POST /api/diagnose` - scores answers, propagates prerequisite effects, and returns the root cause plus explanation

## Scoring behavior

Each concept first receives a raw score from its quiz answers. The backend processes the prerequisite graph from foundations to advanced concepts; when a prerequisite is weak, it caps an otherwise lucky downstream score so the displayed adjusted score reflects the dependency chain.

Adjusted scores are categorized as follows:

| Range | Status | Graph color |
| --- | --- | --- |
| Below 0.60 | Weak | Red |
| 0.60-0.79 | Borderline | Yellow |
| 0.80-1.00 | Strong | Green |

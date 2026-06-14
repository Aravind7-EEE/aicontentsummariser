# AI Content Summarizer

A full-stack AI summarization application built with React, Vite, Node.js, Express, MongoDB, and Google Gemini.

## Features

- Paste large text content and generate AI-powered summaries
- Character count and validation
- Loading states and error messages
- Copy summary button
- Clear input button
- Save summary history in MongoDB
- Responsive modern UI

## Project Structure

- `frontend/` — React app built with Vite
- `backend/` — Express API and MongoDB integration

## Setup

### 1. Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and set your values:
   ```bash
   cp .env.example .env
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Use the app

- Frontend defaults to `http://localhost:5173`
- Backend defaults to `http://localhost:5000`
- The frontend sends requests to `/api/summarize` and `/api/history`

## Environment Variables

Use the following variables inside `backend/.env`:

```ini
PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

Security and deployment notes
- Do NOT commit `backend/.env` or any file containing real secrets to Git.
- Add `backend/.env` to `.gitignore` before creating local secrets.
- For Vercel, set secrets in the Project > Settings > Environment Variables UI
   rather than committing them.

If a secret was accidentally pushed to the repo
- Revoke/rotate the compromised key immediately from the provider.
- Remove the file from Git history (choose one):

   - Using `git filter-repo` (recommended):
      ```bash
      git clone --mirror <REPO_URL> repo.git
      cd repo.git
      git filter-repo --invert-paths --path backend/.env
      git push --force
      ```

   - Using BFG cleaner:
      ```bash
      git clone --mirror <REPO_URL> repo.git
      java -jar bfg.jar --delete-files .env repo.git
      cd repo.git
      git reflog expire --expire=now --all
      git gc --prune=now --aggressive
      git push --force
      ```

Running `npx vercel inspect` to debug a failed deployment
- Run this locally in a terminal where you have `vercel` access:
   ```bash
   npx vercel inspect dpl_8pWemGQiqPVbxWznyQYpPwN3gUyW --logs
   ```
- Paste the resulting logs into the issue or here and I can help interpret them.
```

## Deploy to Vercel

This repository is configured for Vercel with a monorepo setup and API functions.

1. Push your repository to GitHub.
2. Log in to Vercel and import the project.
3. Set the root directory to `/`.
4. In Vercel Environment Variables, add:
   - `MONGO_URI`
   - `GEMINI_API_KEY`
5. For the build settings, use:
   - Build Command: `npm run build`
   - Output Directory: `frontend/dist`

Vercel will deploy the React frontend and route `/api/*` to serverless functions.

## Notes

- Ensure your MongoDB connection string is valid and accessible.
- Ensure your Gemini API key is active and has permission to call the model.

## Folder Overview

- `frontend/src/components` — reusable UI components
- `frontend/src/services` — API client
- `backend/config` — database connection
- `backend/controllers` — business logic
- `backend/routes` — API endpoints
- `backend/services` — Gemini integration
- `backend/models` — MongoDB schemas

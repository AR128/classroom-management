# Student Management System

A full-stack student management application with separate admin and student portals. Administrators can sign in, create, edit, delete, and review student records; students can sign in and view their dashboard and profile.

## Project structure

| Directory | Description |
| --- | --- |
| `frontend/` | React + Vite client application, deployed to Vercel. |
| `backend/` | Express + MongoDB API, deployed to Render. |

Read the component guides for complete setup and API details:

- [Frontend README](frontend/README.md)
- [Backend README](backend/README.md)

## Run locally

Open two terminals from the repository root.

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

Before starting either service, copy each `.env.example` file to a corresponding `.env` file and fill in its values. The frontend's `VITE_BACKEND_URL` should be `http://localhost:3000` during local development.

## Deploy

### 1. Deploy the API to Render

Create a Render Web Service using `backend` as the root directory.

| Render setting | Value |
| --- | --- |
| Build Command | `npm run build` |
| Start Command | `npm start` |

Set the backend environment variables from [backend/.env.example](backend/.env.example). Use `NODE_ENV=production`. You can set `FRONTEND_URL` after the Vercel project has been created.

### 2. Deploy the client to Vercel

Create a Vercel project using `frontend` as the root directory.

| Vercel setting | Value |
| --- | --- |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Set `VITE_BACKEND_URL` to the public Render URL, for example `https://your-api.onrender.com`.

### 3. Connect the deployments

Update Render's `FRONTEND_URL` with the exact Vercel production URL, for example `https://your-app.vercel.app`, then redeploy the backend. This permits browser requests and cross-site refresh cookies between the two services.

## Security notes

- Keep `.env` files private; they are intentionally ignored by Git.
- Use strong, unique values for both JWT secrets and the initial admin password.
- Never put backend secrets in a `VITE_*` variable: Vite exposes those values to browser code.

# Student Management — Backend

This is the Express + MongoDB backend for the Student Management project. It provides authentication for an admin user and a protected dashboard endpoint.

Tech stack

- Node.js (ES module mode)
- Express
- MongoDB (mongoose)
- JWT for authentication

Prerequisites

- Node.js 18+ and npm
- A running MongoDB instance or MongoDB Atlas connection string

Environment variables
Create a `.env` file in `/backend` with at least the following values:

- `MONGODB_URI` — MongoDB connection string
- `EMAIL` — Admin email (used to seed the initial admin)
- `PASSWORD` — Admin password (used to seed the initial admin)
- `ADMIN_USERNAME` — Optional admin username (defaults to `admin`)
- `JWT_SECRET` — Secret used to sign JWTs
- `PORT` — Optional port (default `3000`)

Setup

1. Install dependencies

```bash
cd backend
npm install
```

2. Start the server in development mode (uses `nodemon`)

```bash
npm run dev
```

What the server provides

- Root: `GET /` — quick health/info endpoint
- Auth: `POST /admin/login` — login endpoint (expects `username`, `email`, `password`)
- Protected: `GET /admin/dashboard` — requires a valid `Authorization: Bearer <token>` header

Admin seeding
On first connect the server checks for an admin user with the configured `EMAIL`. If none exists, it will create one using `EMAIL`, `PASSWORD` and `ADMIN_USERNAME` from `.env` (see `src/config/db.js`).

Notes & next steps

- Make sure `JWT_SECRET` is set before starting the server; tokens are signed with this value.
- The dev script is `npm run dev` (runs `nodemon src/index.js`). If you prefer a production start script, you can add a `start` script to `package.json`.
- If you want, I can add an example `.env.example` file and a Postman collection for quick testing.

Relevant files

- [src/index.js](src/index.js) — application entry
- [src/config/db.js](src/config/db.js) — DB connection and initial admin seeding
- [src/routes/authRoutes.js](src/routes/authRoutes.js) — auth routes
- [src/controllers/authController.js](src/controllers/authController.js) — login + dashboard logic

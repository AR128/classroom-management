# Student Management — Frontend

This is the React frontend for the Student Management project, built with Vite.

Tech stack

- React
- Vite
- Tailwind CSS (installed)

Quick start

1. Install dependencies

```bash
cd frontend
npm install
```

2. Run the dev server

```bash
npm run dev
```

3. Build for production

```bash
npm run build
```

Notes

- The frontend expects the backend API to be available (default: `http://localhost:3000`). If your backend runs on a different host/port, update the API base URL in the code where requests are made.
- `npm run lint` runs ESLint across the frontend source.

Main files

- [src/main.jsx](src/main.jsx) — app entry
- [src/App.jsx](src/App.jsx) — top-level routes
- [src/pages](src/pages) — page components (Admin, Student, Home, ProtectedRoute, etc.)

If you want, I can also add a small `.env` example for the frontend to document any environment variables used by API clients.

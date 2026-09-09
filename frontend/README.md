# Student Management Frontend

React single-page application for the Student Management system. It provides separate admin and student sign-in flows, protected dashboards, and student profile management.

## Technology

- React 19
- Vite
- React Router
- Tailwind CSS

## Local setup

Prerequisites: Node.js 18 or later and a running backend API.

```bash
cd frontend
npm install
```

Create `frontend/.env` from `.env.example` and set the API base URL:

```env
VITE_BACKEND_URL=http://localhost:3000
```

Start the development server:

```bash
npm run dev
```

The app is served at the URL displayed by Vite, normally `http://localhost:5173`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Generate the production site in `dist/`. |
| `npm start` | Preview the production build locally. |
| `npm run lint` | Run ESLint. |

## Configuration

`VITE_BACKEND_URL` is required. It is read at build time, so restart the development server after changing `.env` and trigger a new deployment after changing it in Vercel.

Do not add a trailing slash. API requests are assembled from this value, for example `${VITE_BACKEND_URL}/admin/login`.

## Vercel deployment

Create a Vercel project with `frontend` as its root directory. Use:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variable | `VITE_BACKEND_URL=https://your-render-service.onrender.com` |

Deploy the backend first, then use its public Render URL as `VITE_BACKEND_URL`.

## Routes

| Route | Description |
| --- | --- |
| `/` | Landing page |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Admin dashboard |
| `/admin/dashboard/students` | Student list and management |
| `/student/login` | Student login |
| `/student/dashboard` | Student dashboard |

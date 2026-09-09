# Student Management Backend

Express and MongoDB API for the Student Management application. It supports admin and student authentication, JWT-protected endpoints, student CRUD operations, profile-image uploads through Cloudinary, and refresh-token cookies.

## Technology

- Node.js and Express
- MongoDB with Mongoose
- JSON Web Tokens
- Cloudinary and Multer

## Local setup

Prerequisites: Node.js 18 or later and a MongoDB connection string.

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and provide all required values. Never commit `.env` or share its secrets.

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
ADMIN_USERNAME=admin
EMAIL=admin@example.com
PASSWORD=choose_a_strong_password
JWT_SECRET=long_random_secret
JWT_REFRESH_SECRET=another_long_random_secret
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Start the API in development mode:

```bash
npm run dev
```

The server listens on `http://localhost:3000` by default. On its first database connection, it creates the configured admin user when one does not already exist.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start with Nodemon for local development. |
| `npm run build` | Install production dependencies from the lockfile. Used by Render. |
| `npm start` | Start the production server with Node.js. |

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | No | Server port; Render supplies this automatically. |
| `NODE_ENV` | Yes in production | Set to `production` on Render. Enables secure cross-site refresh cookies. |
| `FRONTEND_URL` | Yes in production | Exact Vercel frontend origin allowed by CORS, e.g. `https://your-app.vercel.app`. |
| `MONGODB_URI` | Yes | MongoDB connection string. |
| `ADMIN_USERNAME`, `EMAIL`, `PASSWORD` | Yes | Initial admin account details. |
| `JWT_SECRET`, `JWT_REFRESH_SECRET` | Yes | Secrets used to sign access and refresh tokens. |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Yes for image uploads | Cloudinary credentials. |

## API overview

All protected endpoints require `Authorization: Bearer <access-token>`.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | API health/info response. |
| `POST` | `/admin/login` | Admin authentication. |
| `POST` | `/admin/refresh` | Refresh an admin access token. |
| `GET` | `/admin/dashboard` | Admin dashboard data. |
| `GET` | `/admin/dashboard/students` | List students. |
| `POST` | `/admin/dashboard/add-student` | Create a student; accepts an optional `profileImage` upload. |
| `GET` | `/admin/dashboard/add-student/student-options` | Retrieve form option values. |
| `PUT`, `DELETE` | `/admin/dashboard/students/:id` | Update / delete a student. |
| `POST` | `/student/login` | Student authentication. |
| `GET` | `/student/dashboard` | Student dashboard data. |
| `GET` | `/student/dashboard/:id` | A student profile. |

## Render deployment

Create a Render Web Service with `backend` as its root directory.

| Setting | Value |
| --- | --- |
| Build Command | `npm run build` |
| Start Command | `npm start` |

Add every environment variable shown in `.env.example`, using production values. In particular, set `NODE_ENV=production` and set `FRONTEND_URL` to the exact deployed Vercel URL. The Vercel site must use this Render service URL in its `VITE_BACKEND_URL` variable.

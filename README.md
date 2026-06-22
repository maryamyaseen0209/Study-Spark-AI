# Study SparkAI MERN

Production-oriented MERN foundation for the Study SparkAI educational platform.

## Phase 1 Included

- Express API with Helmet, CORS, compression, rate limiting, Morgan, Winston, cookie parsing, and centralized errors.
- MongoDB/Mongoose connection and production-ready User model.
- JWT auth with access tokens, refresh-token rotation, HTTP-only cookies, email verification, password reset, sessions, and role-ready middleware.
- Nodemailer service with safe dev fallback when SMTP is not configured.
- Socket.io server foundation.
- Vite React frontend with Tailwind CSS, React Router, Axios, React Hook Form, Framer Motion, Hot Toast, and auth pages.
- Role-aware dashboard placeholders for Student, Teacher, and Admin.

## Setup

```bash
cd spark-ai/StudySparkAI-MERN
npm run install:all
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
npm run dev
```

Backend: http://localhost:5000/api/health
Frontend: http://localhost:5173

## Phase Validation

```bash
npm run test:phase1
```

## Notes

Email delivery is skipped in development unless SMTP variables are configured. Verification and reset links are logged by the backend logger when SMTP is missing.

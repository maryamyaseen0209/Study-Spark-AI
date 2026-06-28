# Study SparkAI MERN

Production-oriented MERN foundation for the Study SparkAI educational platform.

## Included Platform Coverage

- Express API with Helmet, CORS, compression, rate limiting, Morgan, Winston, cookie parsing, and centralized errors.
- MongoDB/Mongoose connection and production-ready User model.
- JWT auth with access tokens, refresh-token rotation, HTTP-only cookies, email verification, password reset, sessions, and role-ready middleware.
- Nodemailer service with safe dev fallback when SMTP is not configured.
- Socket.io server foundation.
- Vite React frontend with Tailwind CSS, React Router, Axios, React Hook Form, Framer Motion, Hot Toast, and auth pages.
- Role-aware dashboards for Student, Teacher, and Admin with classrooms, assignments, quizzes, analytics, messages, resources, meetings, notifications, profile/settings, and an Admin Control Suite.
- Admin APIs for overview metrics, filtered user management, announcements, audit logs, moderation, platform analytics, permissions, and system configuration.
- External service wrappers use safe development fallbacks where credentials are not configured.

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

External credentials such as Groq, Cloudinary, Redis, and Zoom are intentionally blank in `.env.example`. Add your own keys locally in `backend/.env`; missing credentials should produce safe configuration-required messages instead of crashing core app flows.

For Zoom live meetings, create a Zoom Server-to-Server OAuth app and set `ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, and `ZOOM_CLIENT_SECRET` in `backend/.env`. This app type runs in the backend and does not use redirect URLs, allow lists, teacher browser login, or `/api/meetings/zoom/callback`. Teachers are stored as the legal app host of each meeting, and the backend asks Zoom to assign the teacher as an alternative host when the teacher is eligible in the connected Zoom account. For Cloudinary resource uploads, set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.

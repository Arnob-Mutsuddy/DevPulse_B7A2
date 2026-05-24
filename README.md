# DevPulse API

A collaborative platform for software teams to report bugs and suggest features.

**Live URL:** https://devpulse-sooty-tau.vercel.app/

---

## Features

- User registration and login with JWT authentication
- Role-based access control (contributor & maintainer)
- Create, read, update, and delete issues
- Filter and sort issues by type and status

---

## Tech Stack

- Node.js, TypeScript, Express.js
- PostgreSQL (NeonDB)
- bcrypt, jsonwebtoken

---

## Setup

```bash
git clone https://github.com/Arnob-Mutsuddy/DevPulse_B7A2.git
cd DevPulse_B7A2
npm install
```

Create `.env` file:
```
DATABASE_URL=your_connection_string (Neon DB)
JWT_SECRET=your_secret_key
PORT=5000
```

```bash
npm run dev
```

---

## API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/signup | Public |
| POST | /api/auth/login | Public |
| GET | /api/issues | Public |
| GET | /api/issues/:id | Public |
| POST | /api/issues | Authenticated |
| PATCH | /api/issues/:id | Authenticated |
| DELETE | /api/issues/:id | Maintainer only |

---

## Database Schema

**users:** id, name, email, password, role, created_at, updated_at

**issues:** id, title, description, type, status, reporter_id, created_at, updated_at
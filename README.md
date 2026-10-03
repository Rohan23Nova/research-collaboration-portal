# Research Collaboration Portal

A modern, full-stack web application for student researchers, faculty guides,
external researchers, and admins to collaborate on research projects.

> **B.Tech Software Engineering Lab Project**

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite, React Router, Tailwind CSS, Axios, Lucide Icons |
| Backend | Node.js + Express (REST API) |
| Database | MySQL (InnoDB) |
| Auth | JWT + bcryptjs |

## Roles
`STUDENT` · `FACULTY` · `EXTERNAL` · `ADMIN`

## Quick Start

### Prerequisites
- Node.js ≥ 18
- MySQL 8.x
- npm

### Setup
```bash
# 1. Clone
git clone https://github.com/Rohan23Nova/research-collaboration-portal.git
cd research-collaboration-portal

# 2. Backend
cd backend
cp .env.example .env    # fill in your values
npm install
npm run dev

# 3. Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### Database
```bash
# Run schema + seed
mysql -u root -p < database/schema.sql
mysql -u root -p research_portal < database/seed.sql
```

## Project Structure
```
research-collaboration-portal/
├── frontend/src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Route-level page components
│   ├── layouts/       # App shell layouts
│   ├── services/      # Axios API calls
│   ├── hooks/         # Custom React hooks
│   ├── context/       # React Context (auth, theme)
│   └── utils/         # Helpers
├── backend/src/
│   ├── controllers/   # Route handlers
│   ├── routes/        # Express routers
│   ├── middleware/     # Auth, role, validation
│   ├── models/        # DB query functions
│   ├── services/      # Business logic
│   └── config/        # DB connection, env
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── README.md
└── docs/
```

## Status
🚧 **Under active development** — built in phases.

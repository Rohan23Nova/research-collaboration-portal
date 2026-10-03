# Research Collaboration Portal 🎓

A full-stack, role-based SaaS platform designed to bridge the gap between researchers, faculty, and students. Built with **React, Node.js, Express, and MySQL**, this platform facilitates project discovery, team formation, workspace management, and real-time communication.

---

## 🚀 Features
- **Role-Based Access Control (RBAC):** Distinct dashboards and permissions for Students, Faculty, and Admins.
- **Project Discovery Engine:** Advanced filtering by research domain and skills.
- **Collaboration Workflow:** Request-to-join engine with transactional approvals and notifications.
- **Integrated Workspace:** Real-time chat (HTTP Polling + Optimistic UI), Document versioning, Milestone/Task tracking, and Progress Reports.
- **Admin Control Center:** Global system statistics, dynamic user role management, and centralized skill dictionary control.
- **Custom Design System:** Built from scratch using Tailwind CSS, featuring dark mode, custom modals, and accessible form controls.

---

## 💻 Tech Stack
- **Frontend:** React 18, Vite, React Router v6, Tailwind CSS, Axios, Lucide React.
- **Backend:** Node.js, Express.js, JSON Web Tokens (JWT), Bcrypt, Multer (File Uploads).
- **Database:** MySQL 8+ (Parameterized queries, ACID Transactions, Foreign Key Constraints).

---

## 🍏 macOS Local Setup Guide

Follow these steps to run the project locally on your Mac for your presentation.

### 1. Prerequisites
Ensure you have Node.js and MySQL installed. If not, use Homebrew:
```bash
brew install node
brew install mysql
brew services start mysql
```

### 2. Create the Database
Log into MySQL and create the database (by default, macOS root user has no password):
```bash
mysql -u root -e "CREATE DATABASE research_portal;"
```

### 3. Install Dependencies
Run the installation script from the root folder (it will install root, backend, and frontend dependencies):
```bash
npm run install:all
# Or manually: npm install && cd backend && npm install && cd ../frontend && npm install
```

### 4. Environment Variables
Create a `.env` file inside the `/backend` directory:
```env
PORT=5001
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=research_portal
JWT_SECRET=super_secret_jwt_key_for_development
FRONTEND_URL=http://localhost:5173
```

### 5. Seed the Database
Initialize the schema and populate it with realistic demo data:
```bash
npm run db:reset
```

### 6. Start the Servers
Launch both the Vite frontend and Express backend concurrently:
```bash
npm run dev
```
> **Frontend:** `http://localhost:5173` | **Backend:** `http://localhost:5001`

---

## 🔑 Demo Credentials

Use these pre-seeded accounts during your Viva to demonstrate the RBAC system:

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| **Admin** | `admin@rcportal.edu` | `Password@123` | Platform management, role changes |
| **Faculty** | `dr.sharma@iit.edu` | `Password@123` | Creating projects, reviewing requests |
| **Student** | `alice.chen@student.edu` | `Password@123` | Searching projects, applying, tasks |
| **External**| `industry.partner@tech.com` | `Password@123` | Testing external collaborator flows |

---

## 📜 NPM Scripts Reference (Root)

| Command | Action |
|---------|--------|
| `npm run dev` | Starts frontend and backend concurrently |
| `npm run install:all` | Installs dependencies for root, frontend, and backend |
| `npm run db:reset` | Drops DB, applies schema, and seeds data (Runs from backend) |

---

## 📂 Project Architecture & Folder Structure

```text
research-collaboration-portal/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection & env config
│   │   ├── controllers/     # Business logic (Req/Res handlers)
│   │   ├── middleware/      # JWT auth, role validation, error handling, Multer
│   │   ├── models/          # Raw MySQL queries (Data Access Layer)
│   │   ├── routes/          # Express route definitions
│   │   ├── database/        # schema.sql and seed.sql
│   │   └── server.js        # Entry point
│   └── uploads/             # Secure, local file storage (Profile images, docs)
├── frontend/
│   ├── src/
│   │   ├── components/      # UI Design System (Button, Modal, Input, etc.)
│   │   ├── context/         # React Context (Auth, Theme, Toast)
│   │   ├── layouts/         # App Shell, Sidebar, Header
│   │   ├── pages/           # Route-level components (Dashboards, Workspace)
│   │   ├── services/        # Axios API instances & interceptors
│   │   └── App.jsx          # React Router setup
└── docs/
    └── API_TESTS.md         # Postman/cURL guide for all API endpoints
```

---

## 🗺️ UML & Architecture to Code Mapping Table

For faculty evaluation, here is exactly where our architectural diagrams map to the codebase:

| Diagram Concept | Implementation Location in Codebase |
|-----------------|-------------------------------------|
| **ER Diagram** (Entity Relations) | `backend/src/database/schema.sql` (13 Tables, FKs, Indexes) |
| **Class Diagram** (Data Objects) | `backend/src/models/*.model.js` (e.g., `project.model.js`) |
| **Sequence Diagram** (Auth Flow) | `backend/src/controllers/auth.controller.js` ↔ `frontend/src/context/AuthContext.jsx` |
| **State Machine** (Requests) | `backend/src/models/request.model.js` (Pending -> Accepted/Rejected transitions) |
| **Component Diagram** (UI) | `frontend/src/pages/projects/workspace/WorkspacePage.jsx` (Tab routing architecture) |
| **Deployment/Network Diagram**| `frontend/src/services/api.js` (Axios Interceptors connecting to Express Port 5001) |

---

## 🗄️ Database Documentation Overview

The relational database strictly enforces data integrity. Highlights include:
- **`ON DELETE CASCADE`**: Removing a `ResearchProject` automatically cleans up associated `ProjectMember`, `Task`, and `Document` rows.
- **Transactions**: Complex operations (like accepting a team member) are wrapped in `connection.beginTransaction()` and `connection.commit()` to ensure ACID compliance.
- **Passwords**: Stored exclusively as `bcrypt` hashes.
- **Optimization**: Indexes placed on `leader_id`, `applicant_id`, and `project_id` for fast dashboard query resolution.

---

## 🌐 API Documentation Overview

The API follows strict RESTful conventions. Responses utilize a standard format:
`{ "success": boolean, "message": string, "data": object }`

* **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
* **Projects**: `GET /api/projects`, `POST /api/projects`, `GET /api/projects/:id`
* **Requests**: `POST /api/projects/:id/requests`, `PUT /api/requests/:id/accept`
* **Workspace**: `GET /api/projects/:id/workspace/tasks`, `POST /api/projects/:id/workspace/messages`
* **Admin**: `GET /api/admin/users`, `PUT /api/admin/users/:id/role`

*(See `docs/API_TESTS.md` for exact cURL requests).*

---

## 🎬 5-Minute Viva Demo Script

Use this script to perfectly showcase the platform's capabilities during your presentation:

**Step 1: Faculty Dashboard & Project Creation (1 min)**
1. Log in as Faculty (`dr.sharma@iit.edu`).
2. Show the dynamic Faculty Dashboard (Projects Led, Pending Requests).
3. Navigate to **Projects** -> **Create Project**.
4. Create a new research project, attach some required skills, and publish it.

**Step 2: Student Discovery & Application (1.5 mins)**
1. Open an **Incognito Window** and log in as Student (`alice.chen@student.edu`).
2. Go to **Projects** (Discovery Page). Show the search bar and skill filters.
3. Find Dr. Sharma's new project. Click **View Details**.
4. Click **Request to Join**, add a personalized message, and submit.
5. Note the button dynamically changes to "Request Pending".

**Step 3: Leader Approval (ACID Transaction) (1 min)**
1. Switch back to Dr. Sharma's window. Notice the **Notification Bell** has a red dot.
2. Go to **Review Requests**.
3. View Alice's profile (Modal popup). Click **Accept**.
4. Explain to the examiner: *"This triggers a MySQL transaction that updates the request status, inserts Alice into the ProjectMember table, and generates a notification, ensuring database consistency."*

**Step 4: Project Workspace (1 min)**
1. Go to the Project Workspace.
2. **Team Tab:** Show Alice is now a member.
3. **Tasks Tab:** Create a task and assign it to Alice.
4. **Chat Tab:** Send a message. Explain that it uses short-polling and an optimistic UI for a real-time feel without heavy WebSockets.
5. Switch to Alice's window and show the message arriving and the task assigned.

**Step 5: Admin Control Center (0.5 mins)**
1. Log out Dr. Sharma and log in as Admin (`admin@rcportal.edu`).
2. Show the **Admin Dashboard** with global platform statistics.
3. Click **Manage Users** and show how you can upgrade a Student to Faculty instantly.
4. Conclude the presentation.

---
*Built with ❤️ for B.Tech Software Engineering Lab.*

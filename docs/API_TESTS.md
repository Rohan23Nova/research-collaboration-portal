# API Testing Guide (cURL Collection)

This document provides a suite of curl commands to test the core features of the Research Collaboration Portal.

> **Pre-requisites:**
> Ensure your server is running on `http://localhost:5001`.
> The examples below use `jq` for formatting (or you can pipe to `python3 -m json.tool`).
> **Important:** Always extract the JWT token from the Login step to use in the `Authorization: Bearer <token>` header for subsequent requests.

---

## 1. Authentication (Auth)

**Register a New User:**
```bash
curl -X POST http://localhost:5001/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password@123",
  "role": "STUDENT"
}'
```

**Login (Get Token):**
```bash
curl -X POST http://localhost:5001/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "jane@example.com",
  "password": "Password@123"
}'
```

**Get Current User Profile (/me):**
```bash
curl -X GET http://localhost:5001/api/auth/me \
-H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 2. Authorization (Role-Based Access)

*Test that a STUDENT cannot access ADMIN routes.*

**Attempt to get all users (Admin Route) as a Student:**
```bash
curl -X GET http://localhost:5001/api/admin/users \
-H "Authorization: Bearer STUDENT_TOKEN_HERE"
```
*Expected: 403 Forbidden - "Access denied. Requires one of: ADMIN"*

**Access Dashboard as a Student:**
```bash
curl -X GET http://localhost:5001/api/dashboard \
-H "Authorization: Bearer STUDENT_TOKEN_HERE"
```
*Expected: 200 OK - Returns `activeProjects`, `upcomingTasks`.*

---

## 3. Collaboration Workflow (Requests & Teams)

**Student Requests to Join a Project:**
```bash
curl -X POST http://localhost:5001/api/projects/1/requests \
-H "Authorization: Bearer STUDENT_TOKEN_HERE" \
-H "Content-Type: application/json" \
-d '{
  "message": "I am highly interested in this medical imaging research!"
}'
```

**Leader Checks Incoming Requests:**
```bash
curl -X GET http://localhost:5001/api/requests/incoming \
-H "Authorization: Bearer LEADER_TOKEN_HERE"
```

**Leader Accepts the Request:**
```bash
# Note: Replace <request_id> with the ID from the previous step
curl -X PUT http://localhost:5001/api/requests/<request_id>/accept \
-H "Authorization: Bearer LEADER_TOKEN_HERE"
```

---

## 4. Workspace: Documents & Tasks

**Upload a Document:**
```bash
echo "Sample research data" > sample.txt

curl -X POST http://localhost:5001/api/projects/1/workspace/documents \
-H "Authorization: Bearer MEMBER_TOKEN_HERE" \
-F "document=@sample.txt"
```

**List Documents:**
```bash
curl -X GET http://localhost:5001/api/projects/1/workspace/documents \
-H "Authorization: Bearer MEMBER_TOKEN_HERE"
```

**Create a Milestone (Leader Only):**
```bash
curl -X POST http://localhost:5001/api/projects/1/workspace/milestones \
-H "Authorization: Bearer LEADER_TOKEN_HERE" \
-H "Content-Type: application/json" \
-d '{
  "title": "Data Preprocessing",
  "description": "Clean the dataset",
  "due_date": "2026-12-31"
}'
```

**Assign a Task to a Member:**
```bash
# Note: Replace <milestone_id> and <user_id>
curl -X POST http://localhost:5001/api/projects/1/workspace/milestones/<milestone_id>/tasks \
-H "Authorization: Bearer LEADER_TOKEN_HERE" \
-H "Content-Type: application/json" \
-d '{
  "title": "Write normalization script",
  "description": "Scale images to 255",
  "due_date": "2026-11-01",
  "assigned_to": <user_id>
}'
```

**Member Updates Task Status:**
```bash
curl -X PUT http://localhost:5001/api/projects/1/workspace/tasks/<task_id>/status \
-H "Authorization: Bearer ASSIGNEE_TOKEN_HERE" \
-H "Content-Type: application/json" \
-d '{
  "status": "In Progress"
}'
```

---

## 5. Notifications

**Fetch My Notifications:**
```bash
curl -X GET http://localhost:5001/api/notifications \
-H "Authorization: Bearer USER_TOKEN_HERE"
```

**Mark All Read:**
```bash
curl -X PUT http://localhost:5001/api/notifications/mark-all-read \
-H "Authorization: Bearer USER_TOKEN_HERE"
```

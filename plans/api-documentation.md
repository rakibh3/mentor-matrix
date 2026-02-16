# Bootcamp Tracker API Documentation

Base URL: `http://localhost:5000/api/v1`

Authentication: Bearer token in `Authorization` header

---

## Auth

| Method | Endpoint | Description | Auth | Request | Response |
|--------|----------|-------------|------|---------|----------|
| POST | /auth/request-otp | Request OTP via email | Public | email | success, message |
| POST | /auth/verify-otp | Verify OTP and receive JWT | Public | email, otp | accessToken, user |
| POST | /auth/register | Register new student | Public | name, email, phone, discordUsername | success, message |

---

## Users

| Method | Endpoint | Description | Auth | Request | Response |
|--------|----------|-------------|------|---------|----------|
| GET | /users | List all users | Admin, Superadmin | - | users[] |
| GET | /users/srms | List all SRMs | Admin, Superadmin | - | users[] |
| GET | /user/:userId | Get single user | Admin, Superadmin, Self | - | user |
| PATCH | /user/:userId/role | Update user role | Superadmin | role | updated user |
| PATCH | /user/:userId/data | Update user data | Admin, Superadmin, Self | name, email | updated user |
| DELETE | /user/:userId | Delete user | Admin, Superadmin | - | success, message |

---

## Students

| Method | Endpoint | Description | Auth | Request | Response |
|--------|----------|-------------|------|---------|----------|
| GET | /users/students | List all students | Admin, Superadmin, SRM | - | students[] with user info |
| GET | /user/:userId/student | Get student by user ID | Admin, Superadmin, SRM | - | student with user info |
| PATCH | /user/:userId/assign-srm | Assign SRM to student | Admin, Superadmin | srmId | updated student |
| PATCH | /user/:userId/block | Block/unblock student | Admin, Superadmin | isBlocked | updated student |

---

## Attendance

| Method | Endpoint | Description | Auth | Request | Response |
|--------|----------|-------------|------|---------|----------|
| POST | /create-attendance | Mark attendance | Student | studentId, status, mission, module, moduleVideo, note | attendance record |
| GET | /get-attendance | Get all attendance records | Admin, Superadmin | absentFilter, searchTerm | attendance[] with student info |
| GET | /get-attendance/student | Get own attendance | Student | - | attendance[] |
| GET | /get-attendance/student/:studentId | Get specific student attendance | Admin, Superadmin, Assigned SRM | - | attendance[] |
| PATCH | /update-attendance/:attendanceId | Update attendance record | Admin, Superadmin | status, note | updated attendance |
| DELETE | /delete-attendance/:attendanceId | Delete attendance record | Admin, Superadmin | - | success, message |
| POST | /mark-absent | Bulk mark students absent | Admin, Superadmin | date | count, message |

---

## Attendance Window

| Method | Endpoint | Description | Auth | Request | Response |
|--------|----------|-------------|------|---------|----------|
| POST | /open-window | Open attendance window | Admin, Superadmin | - | success, message |
| POST | /close-window | Close attendance window | Admin, Superadmin | - | success, message |
| GET | /window-status | Get window status | Any | - | isOpen, openedAt, closedAt |

---

## Tasks

| Method | Endpoint | Description | Auth | Request | Response |
|--------|----------|-------------|------|---------|----------|
| POST | /task | Create task | Admin, Superadmin | mission, moduleNumber, videoNumber, guideline, dueDate, createdBy | task |
| PATCH | /task/:taskId | Update task | Admin, Superadmin | mission, moduleNumber, videoNumber, guideline, dueDate | updated task |
| GET | /task/current | Get current task | Any | - | task |
| GET | /task/upcoming | Get upcoming task | Any | - | task |
| GET | /task/due | Get due/overdue tasks | Any | - | tasks[] |
| DELETE | /task/:taskId | Delete task | Admin, Superadmin | - | success, message |

---

## Call History

| Method | Endpoint | Description | Auth | Request | Response |
|--------|----------|-------------|------|---------|----------|
| POST | /calls | Log outreach call | Admin, Superadmin, SRM | studentId, outcome, note | call record |
| GET | /calls/student/:studentId | Get student call history | Admin, Superadmin, Assigned SRM | - | calls[] |
| GET | /calls/srm/:srmId | Get SRM call history | Admin, Superadmin, Self | - | calls[] |

---

## Analytics

| Method | Endpoint | Description | Auth | Request | Response |
|--------|----------|-------------|------|---------|----------|
| GET | /analytics/dashboard | Get dashboard stats | Admin, Superadmin, SRM | - | totalStudents, totalSrms, attendanceRate, riskDistribution, recentCalls |
| GET | /analytics/srm/:srmId | Get SRM performance | Admin, Superadmin, Self | - | totalCalls, callsToday, callsThisWeek, assignedStudents, callsByOutcome |
| GET | /analytics/attendance/trends | Get attendance trends | Admin, Superadmin, SRM | days | trends[] |

---

## Data Models

### User
- _id: ObjectId
- name: String
- email: String
- role: Enum['student', 'admin', 'superadmin', 'srm']
- lastLoginAt: Date
- createdAt: Date
- updatedAt: Date

### Student
- _id: ObjectId
- userId: ObjectId (ref: User)
- phone: String
- discordUsername: String
- assignedSrmId: ObjectId (ref: User)
- isBlocked: Boolean
- createdAt: Date
- updatedAt: Date

### Attendance
- _id: ObjectId
- studentId: ObjectId (ref: Student)
- status: Enum['ATTENDED', 'ABSENT']
- mission: Number (1-8)
- module: Number (1-6)
- moduleVideo: Number
- date: Date
- note: String
- createdAt: Date
- updatedAt: Date

### Task
- _id: ObjectId
- mission: Number (1-8)
- moduleNumber: Number (1-6)
- videoNumber: String
- guideline: String
- dueDate: Date
- createdBy: ObjectId (ref: User)
- createdAt: Date
- updatedAt: Date

### Call History
- _id: ObjectId
- studentId: ObjectId (ref: Student)
- srmId: ObjectId (ref: User)
- outcome: Enum['Received', 'Not Received', 'Busy', 'Foreign Number', 'Wrong Number', 'Discord Action']
- note: String
- date: Date
- createdAt: Date

### Attendance Window
- _id: ObjectId
- isOpen: Boolean
- openedAt: Date
- closedAt: Date
- openedBy: ObjectId (ref: User)

---

## Roles

| Role | Permissions |
|------|-------------|
| student | Mark own attendance, view own attendance, view tasks |
| srm | View assigned students, log calls, view analytics |
| admin | Full access except role changes |
| superadmin | Full access including role changes |

---

## Query Parameters

| Endpoint | Parameter | Type | Description |
|----------|-----------|------|-------------|
| GET /get-attendance | absentFilter | String | Filter: today, last2days, last3days |
| GET /get-attendance | searchTerm | String | Search by student name or email |
| GET /analytics/attendance/trends | days | Number | Number of days to include (default: 7) |

# Bootcamp Tracker - Backend Plan

Based on postman_collection.json - excludes existing endpoints, adds missing ones needed for frontend.

---

## Existing Endpoints (from Postman)

### Auth
- POST /auth/request-otp
- POST /auth/verify-otp
- POST /auth/register

### User
- GET /users
- PATCH /user/:userId/role
- PATCH /user/:userId/data
- DELETE /user/:userId

### Attendance
- POST /create-attendance
- GET /get-attendance
- GET /get-attendance/student
- PATCH /update-attendance/:attendanceId
- DELETE /delete-attendance/:attendanceId
- POST /open-window
- POST /close-window
- GET /window-status
- POST /mark-absent

### Task
- POST /task
- PATCH /task/:taskId
- GET /task/current
- GET /task/upcoming
- GET /task/due
- DELETE /task/:taskId

---

## Additional Endpoints Needed

### User
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /users/students | List students with attendance stats | Admin, Superadmin, SRM |
| GET | /users/srms | List all SRMs | Admin, Superadmin |
| GET | /user/:userId | Get single user | Admin, Superadmin, Self |
| PATCH | /user/:userId/assign-srm | Assign SRM to student | Admin, Superadmin |
| PATCH | /user/:userId/block | Block/unblock student | Admin, Superadmin |

### Attendance
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /get-attendance/student/:studentId | Get specific student attendance | Admin, Superadmin, Assigned SRM |

### Call History (New Module)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /calls | Log outreach call | Admin, Superadmin, SRM |
| GET | /calls/student/:studentId | Get student call history | Admin, Superadmin, Assigned SRM |
| GET | /calls/srm/:srmId | Get SRM call history | Admin, Superadmin, Self |

### Analytics (New Module)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /analytics/dashboard | Dashboard overview stats | Admin, Superadmin |
| GET | /analytics/srm/:srmId | SRM performance metrics | Admin, Superadmin, Self |
| GET | /analytics/attendance/trends | Attendance trends over time | Admin, Superadmin |

---

## Database Design

### 1. users
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | PK |
| name | String | Full name |
| email | String | Unique, indexed |
| role | String | student, admin, superadmin, srm |
| lastLoginAt | Date | Timestamp |
| createdAt | Date | Auto |
| updatedAt | Date | Auto |

**Indexes**: email (unique), role

---

### 2. students
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | PK |
| userId | ObjectId | Ref: users |
| phone | String | Contact number |
| discordUsername | String | Discord handle |
| assignedSrmId | ObjectId | Ref: users (SRM) |
| isBlocked | Boolean | Default: false |
| createdAt | Date | Auto |
| updatedAt | Date | Auto |

**Indexes**: userId (unique), assignedSrmId

---

### 3. attendances
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | PK |
| studentId | ObjectId | Ref: students |
| status | String | ATTENDED, ABSENT |
| mission | Number | 1-8 |
| module | Number | 1-6 |
| moduleVideo | Number | Video number |
| date | Date | Attendance date |
| note | String | Optional |
| createdAt | Date | Auto |
| updatedAt | Date | Auto |

**Indexes**: studentId + date (compound), date

---

### 4. tasks
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | PK |
| mission | Number | 1-8 |
| moduleNumber | Number | 1-6 |
| videoNumber | String | Optional |
| guideline | String | Task description |
| dueDate | Date | Deadline |
| createdBy | ObjectId | Ref: users |
| createdAt | Date | Auto |
| updatedAt | Date | Auto |

**Indexes**: dueDate

---

### 5. callhistories
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | PK |
| studentId | ObjectId | Ref: students |
| srmId | ObjectId | Ref: users |
| outcome | String | Received, Not Received, Busy, Foreign Number, Wrong Number, Discord Action |
| note | String | Call notes |
| date | Date | When call made |
| createdAt | Date | Auto |

**Indexes**: studentId + date, srmId + date

---

### 6. attendancewindows
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | PK |
| isOpen | Boolean | Window status |
| openedAt | Date | When opened |
| closedAt | Date | When closed |
| openedBy | ObjectId | Ref: users |
| createdAt | Date | Auto |
| updatedAt | Date | Auto |

**Note**: Single document (singleton)

---

---

## Business Logic

### Authentication
1. User submits email to request-otp
2. System generates 6-digit OTP, stores in Redis with expiry (5 minutes)
3. Sends OTP via email
4. User submits email + OTP to verify-otp
5. System validates OTP from Redis
6. On success, delete Redis key and issue JWT with userId, role, email

### Attendance Window
- Single document tracks open/closed state
- Only admins can open/close via endpoints
- Students can only mark attendance when isOpen=true

### Mark Attendance
1. Check window is open (attendancewindows.isOpen)
2. Check student has no attendance record for today
3. Create attendance record with mission/module/video
4. Return success response

### Bulk Absent (mark-absent)
1. Accept date parameter
2. Find all students with no attendance record for that date
3. Create ABSENT records for each missing student
4. Return count of students marked absent

### Student Status Logic
- Status derived from isBlocked field
- isBlocked=false: Active
- isBlocked=true: Inactive/Blocked

### Risk Assessment
- Calculate from attendance records per student
- High Risk: attendance rate < 70%
- Medium Risk: attendance rate 70-85%
- Low Risk: attendance rate > 85%
- Flag high-risk students for SRM attention

### SRM Assignment
- Store assignedSrmId on students collection
- SRM dashboard queries students where assignedSrmId = srm's _id
- SRM can only view/modify their assigned students

### Call Logging
1. SRM submits studentId, outcome, note to POST /calls
2. System stores srm from authenticated JWT
3. Create call history record
4. Increment student's callCount (computed or stored)

### Task Categories
- Current: dueDate is today
- Upcoming: dueDate is tomorrow
- Due/Overdue: dueDate has passed

### Analytics Calculation
- Attendance %: (ATTENDED count / total records) × 100
- Cohort stats: Group users by assignedSrmId, aggregate
- SRM performance: Count calls by srm per day, student progress
- Trends: Compare week-over-week attendance rates

---

## Environment Variables

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bootcamp_tracker
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=email@gmail.com
SMTP_PASS=app_password
CLIENT_URL=http://localhost:5173
```

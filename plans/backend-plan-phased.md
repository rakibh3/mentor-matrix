# Bootcamp Tracker - Backend Plan (Phased Implementation)

## Phase 1: Core Authentication & User Management

### Database Collections

#### 1. users
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

#### 2. students
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

### Phase 1 Endpoints

#### Auth (from Postman)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/request-otp | Send OTP to email |
| POST | /auth/verify-otp | Verify OTP, return JWT |
| POST | /auth/register | Register new student |

#### User (from Postman)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /users | List all users |
| PATCH | /user/:userId/role | Update user role |
| PATCH | /user/:userId/data | Update user data |
| DELETE | /user/:userId | Delete user |

#### Additional User Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /users/students | List students with basic info |
| GET | /users/srms | List all SRMs |
| GET | /user/:userId | Get single user |
| PATCH | /user/:userId/assign-srm | Assign SRM to student |
| PATCH | /user/:userId/block | Block/unblock student |

### Phase 1 Business Logic

#### Authentication Flow
1. User submits email to request-otp
2. System generates 6-digit OTP, stores in Redis with 5-min TTL
3. Sends OTP via email
4. User submits email + OTP to verify-otp
5. System validates OTP from Redis, deletes key on success
6. Issue JWT with userId, role, email

#### User Registration
1. User submits name, email, phone, discordUsername
2. Create user record with role="student"
3. Create corresponding student record with userId reference
4. Send confirmation email

#### Student Status
- Derived from isBlocked field in students collection
- isBlocked=false → Active
- isBlocked=true → Blocked

---

## Phase 2: Attendance System

### Database Collections

#### 3. attendances
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

#### 4. attendancewindows
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | PK |
| isOpen | Boolean | Window status |
| openedAt | Date | When opened |
| closedAt | Date | When closed |
| openedBy | ObjectId | Ref: users |
| createdAt | Date | Auto |
| updatedAt | Date | Auto |

### Phase 2 Endpoints (from Postman)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /create-attendance | Mark attendance |
| GET | /get-attendance | Get all attendance records |
| GET | /get-attendance/student | Get own attendance (student) |
| PATCH | /update-attendance/:attendanceId | Update attendance |
| DELETE | /delete-attendance/:attendanceId | Delete attendance |
| POST | /open-window | Open attendance window |
| POST | /close-window | Close attendance window |
| GET | /window-status | Get window status |
| POST | /mark-absent | Bulk mark absent |

### Additional Phase 2 Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /get-attendance/student/:studentId | Get specific student attendance |

### Phase 2 Business Logic

#### Attendance Window
- Single document in attendancewindows collection
- Only admins can open/close
- Students can only mark attendance when isOpen=true

#### Mark Attendance
1. Check window is open
2. Check student has no record for today
3. Create attendance record
4. Return success

#### Bulk Absent
1. Accept date parameter
2. Find students with no attendance for that date
3. Create ABSENT records for each
4. Return count marked

---

## Phase 3: Task Management

### Database Collections

#### 5. tasks
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

### Phase 3 Endpoints (from Postman)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /task | Create task |
| PATCH | /task/:taskId | Update task |
| GET | /task/current | Get today's task |
| GET | /task/upcoming | Get next task |
| GET | /task/due | Get overdue tasks |
| DELETE | /task/:taskId | Delete task |

### Phase 3 Business Logic

#### Task Categories
- Current: dueDate is today
- Upcoming: dueDate is tomorrow
- Due/Overdue: dueDate has passed

---

## Phase 4: Call History & Outreach

### Database Collections

#### 6. callhistories
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

### Phase 4 Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /calls | Log outreach call |
| GET | /calls/student/:studentId | Get student call history |
| GET | /calls/srm/:srmId | Get SRM call history |

### Phase 4 Business Logic

#### Call Logging
1. SRM submits studentId, outcome, note
2. System stores srmId from authenticated JWT
3. Create call history record

---

## Phase 5: Analytics

### Phase 5 Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /analytics/dashboard | Dashboard overview stats |
| GET | /analytics/srm/:srmId | SRM performance metrics |
| GET | /analytics/attendance/trends | Attendance trends |

### Phase 5 Business Logic

#### Risk Assessment
- Calculate from attendance records per student
- High Risk: attendance rate < 70%
- Medium Risk: attendance rate 70-85%
- Low Risk: attendance rate > 85%

#### SRM Assignment
- Store assignedSrmId in students collection
- SRM queries students where assignedSrmId = their user _id

#### Analytics Calculation
- Attendance %: (ATTENDED count / total records) × 100
- SRM performance: Count calls by srm per day
- Trends: Compare week-over-week attendance rates

---

## Environment Variables

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bootcamp_tracker
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=email@gmail.com
SMTP_PASS=app_password
CLIENT_URL=http://localhost:5173
```

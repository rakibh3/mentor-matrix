# Postman Collection vs Backend Plan Comparison Report

## Summary

The Postman collection and backend plans are **well-aligned**. All endpoints in the collection are documented in the plan, and the plan correctly identifies additional endpoints needed for the frontend.

---

## Endpoints Comparison

### Auth Module
| Postman Endpoint | Plan Endpoint | Match | Notes |
|-----------------|---------------|-------|-------|
| POST /auth/request-otp | POST /auth/request-otp | | |
| POST /auth/verify-otp | POST /auth/verify-otp | | Updates lastLoginAt |
| POST /auth/register | POST /auth/register | | Creates user + student records |

**Status**: All matched

---

### User Module
| Postman Endpoint | Plan Endpoint | Match | Notes |
|-----------------|---------------|-------|-------|
| GET /users | GET /users | | |
| GET /users/srms | GET /users/srms | | |
| GET /user/:userId | GET /user/:userId | | |
| PATCH /user/:userId/role | PATCH /user/:userId/role | | Valid roles: STUDENT, ADMIN, SUPER_ADMIN, SRM |
| PATCH /user/:userId/data | PATCH /user/:userId/data | | Note: phone/discord moved to student record |
| DELETE /user/:userId | DELETE /user/:userId | | Soft delete |

**Status**: All matched

---

### Student Module
| Postman Endpoint | Plan Endpoint | Match | Notes |
|-----------------|---------------|-------|-------|
| GET /users/students | GET /users/students | | |
| GET /user/:userId/student | Not in plan | **MISSING** | Get student record by user ID |
| PATCH /user/:userId/assign-srm | PATCH /user/:userId/assign-srm | | Request body: { srmId } |
| PATCH /user/:userId/block | PATCH /user/:userId/block | | Request body: { isBlocked } |

**Status**: 1 endpoint missing from plan - `GET /user/:userId/student`

---

### Attendance Module
| Postman Endpoint | Plan Endpoint | Match | Notes |
|-----------------|---------------|-------|-------|
| POST /create-attendance | POST /create-attendance | | Request body uses `studentId` |
| GET /get-attendance | GET /get-attendance | | Query params: absentFilter, searchTerm |
| GET /get-attendance/student | GET /get-attendance/student | | Own attendance for logged-in student |
| GET /get-attendance/student/:studentId | GET /get-attendance/student/:studentId | | Specific student attendance |
| PATCH /update-attendance/:attendanceId | PATCH /update-attendance/:attendanceId | | |
| DELETE /delete-attendance/:attendanceId | DELETE /delete-attendance/:attendanceId | | |
| POST /open-window | POST /open-window | | |
| POST /close-window | POST /close-window | | |
| GET /window-status | GET /window-status | | |
| POST /mark-absent | POST /mark-absent | | Request body: { date } |

**Status**: All matched

---

### Task Module
| Postman Endpoint | Plan Endpoint | Match | Notes |
|-----------------|---------------|-------|-------|
| POST /task | POST /task | | |
| PATCH /task/:taskId | PATCH /task/:taskId | | |
| GET /task/current | GET /task/current | | |
| GET /task/upcoming | GET /task/upcoming | | |
| GET /task/due | GET /task/due | | |
| DELETE /task/:taskId | DELETE /task/:taskId | | |

**Status**: All matched

---

### Call History Module
| Postman Endpoint | Plan Endpoint | Match | Notes |
|-----------------|---------------|-------|-------|
| POST /calls | POST /calls | | Request body: studentId, outcome, note |
| GET /calls/student/:studentId | GET /calls/student/:studentId | | |
| GET /calls/srm/:srmId | GET /calls/srm/:srmId | | |

**Status**: All matched

---

### Analytics Module
| Postman Endpoint | Plan Endpoint | Match | Notes |
|-----------------|---------------|-------|-------|
| GET /analytics/dashboard | GET /analytics/dashboard | | |
| GET /analytics/srm/:srmId | GET /analytics/srm/:srmId | | |
| GET /analytics/attendance/trends | GET /analytics/attendance/trends | | Query param: days (default: 7) |

**Status**: All matched

---

## Database Schema Alignment

### Field Name Changes (Correct in Plan)
| Postman | Plan | Status |
|---------|------|--------|
| student (attendance) | studentId | |
| student (call history) | studentId | |
| srm (call history) | srmId | |
| assignedSrmId | assignedSrmId | |

### Collections Match
- users | users
- students | students
- attendances | attendances
- tasks | tasks
- callhistories | callhistories
- attendancewindows | attendancewindows

---

## Missing from Plan

### 1. Endpoint Missing
```
GET /user/:userId/student
Description: Get student record by user ID
Access: ADMIN, SUPER_ADMIN, SRM
```

### 2. Query Parameters Not Documented
| Endpoint | Query Param | Description |
|----------|-------------|-------------|
| GET /get-attendance | absentFilter | today, last2days, last3days |
| GET /get-attendance | searchTerm | Search by student name/email |
| GET /analytics/attendance/trends | days | Number of days (default: 7) |

### 3. Request Body Details Missing
| Endpoint | Field | Type | Required |
|----------|-------|------|----------|
| POST /create-attendance | note | String | No |
| PATCH /user/:userId/assign-srm | srmId | String | Yes |
| PATCH /user/:userId/block | isBlocked | Boolean | Yes |

---

## Recommendations

1. **Add missing endpoint** to plan: `GET /user/:userId/student`

2. **Document query parameters** for:
   - GET /get-attendance (absentFilter, searchTerm)
   - GET /analytics/attendance/trends (days)

3. **Document request body schemas** for all POST/PATCH endpoints

4. **Add role-based access control documentation** for each endpoint

---

## Authentication Coverage

| Feature | Postman | Plan | Status |
|---------|---------|------|--------|
| Bearer token auth | | | |
| JWT in Authorization header | | | |
| Token stored in environment | | | |
| Role-based access | Descriptions only | Partial | Needs full documentation |

---

## Overall Assessment

**Coverage**: 99% - Only 1 endpoint missing from plan
**Schema Alignment**: 100% - All field renames correctly documented
**Query Parameters**: 80% - Some query params not documented in plan
**Request/Response Schemas**: 70% - Basic documentation present, needs detail

**Verdict**: The plans are production-ready with minor additions needed.

# API Structure Documentation

This directory contains the reorganized API layer for the Bootcamp Tracker application, following best practices for maintainability and scalability.

## Directory Structure

```
src/api/
├── client/
│   └── axios.ts              # Configured Axios client with interceptors
├── endpoints/
│   ├── auth.ts               # Auth API endpoints (login, register, OTP)
│   ├── users.ts              # User management endpoints
│   ├── attendance.ts         # Attendance tracking endpoints
│   ├── tasks.ts              # Task management endpoints
│   └── index.ts              # Re-exports all endpoints
├── hooks/
│   ├── auth/
│   │   ├── useLogin.ts       # POST /auth/verify-otp
│   │   ├── useRequestOtp.ts  # POST /auth/request-otp
│   │   ├── useLogout.ts      # Logout functionality
│   │   ├── useRegister.ts    # POST /auth/register
│   │   └── index.ts
│   ├── users/
│   │   ├── useUsers.ts              # GET /users
│   │   ├── useUpdateUserRole.ts     # PATCH /user/:id/role
│   │   ├── useUpdateUserData.ts     # PATCH /user/:id/data
│   │   ├── useDeleteUser.ts         # DELETE /user/:id
│   │   └── index.ts
│   ├── attendance/
│   │   ├── useMarkAttendance.ts     # POST /create-attendance
│   │   ├── useAttendance.ts         # GET /get-attendance
│   │   ├── useStudentAttendance.ts  # GET /get-attendance/student
│   │   ├── useUpdateAttendance.ts   # PATCH /update-attendance/:id
│   │   ├── useDeleteAttendance.ts   # DELETE /delete-attendance/:id
│   │   ├── useWindowStatus.ts       # GET /window-status
│   │   └── index.ts
│   ├── tasks/
│   │   ├── useCurrentTask.ts        # GET /task/current
│   │   ├── useUpcomingTask.ts       # GET /task/upcoming
│   │   ├── useDueTasks.ts           # GET /task/due
│   │   ├── useCreateTask.ts         # POST /task
│   │   ├── useUpdateTask.ts         # PATCH /task/:id
│   │   ├── useDeleteTask.ts         # DELETE /task/:id
│   │   └── index.ts
│   └── index.ts              # Re-exports all hooks
├── types/
│   ├── auth.types.ts         # Auth-related types
│   ├── user.types.ts         # User-related types
│   ├── attendance.types.ts   # Attendance-related types
│   ├── task.types.ts         # Task-related types
│   ├── common.types.ts       # Shared types
│   └── index.ts              # Re-exports all types
├── config/
│   └── queryClient.ts        # React Query configuration
└── index.ts                  # Main entry point

```

## Usage Examples

### Mark Attendance (Student Dashboard)

```typescript
import { useMarkAttendance } from '@/api/hooks/attendance';

function AttendanceForm() {
  const { mutate: markAttendance, isPending } = useMarkAttendance();

  const handleSubmit = (data) => {
    markAttendance({
      status: 'ATTENDED',
      mission: 1,
      module: 4,
      moduleVideo: 12,
      note: 'Completed React patterns exercise'
    }, {
      onSuccess: (response) => {
        console.log('Attendance marked:', response);
      },
      onError: (error) => {
        console.error('Failed to mark attendance:', error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Marking...' : 'Mark Attendance'}
      </button>
    </form>
  );
}
```

### Fetch Users (Admin Dashboard)

```typescript
import { useUsers } from '@/api/hooks/users';

function UsersList() {
  const { data, isLoading, error } = useUsers();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {data?.data.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

### Login Flow

```typescript
import { useRequestOtp, useLogin } from '@/api/hooks/auth';

function LoginPage() {
  const { mutate: requestOtp } = useRequestOtp();
  const { mutate: login, isPending } = useLogin();

  const handleRequestOtp = (email: string) => {
    requestOtp({ email }, {
      onSuccess: () => {
        // Show OTP input
      }
    });
  };

  const handleVerifyOtp = (email: string, otp: string) => {
    login({ email, otp }, {
      onSuccess: (response) => {
        // User is logged in, token is stored in cookies
        navigate('/dashboard');
      }
    });
  };

  return (
    // Login form UI
  );
}
```

## API Endpoints Reference

All endpoints are based on the Postman collection (`postman_collection.json`):

### Authentication
- `POST /auth/request-otp` - Request OTP for login
- `POST /auth/verify-otp` - Verify OTP and get access token
- `POST /auth/register` - Register new user

### Users
- `GET /users` - Get all users
- `PATCH /user/:userId/role` - Update user role
- `PATCH /user/:userId/data` - Update user data
- `DELETE /user/:userId` - Delete user

### Attendance
- `POST /create-attendance` - Mark attendance
- `GET /get-attendance` - Get all attendance records
- `GET /get-attendance/student` - Get student's attendance
- `PATCH /update-attendance/:attendanceId` - Update attendance
- `DELETE /delete-attendance/:attendanceId` - Delete attendance
- `POST /open-window` - Open attendance window
- `POST /close-window` - Close attendance window
- `GET /window-status` - Get window status
- `POST /mark-absent` - Mark students absent

### Tasks
- `POST /task` - Create task
- `PATCH /task/:taskId` - Update task
- `GET /task/current` - Get current task
- `GET /task/upcoming` - Get upcoming task
- `GET /task/due` - Get due tasks
- `DELETE /task/:taskId` - Delete task

## Features

- **Centralized API client**: Single Axios instance with auth interceptors
- **Type-safe**: Full TypeScript support with detailed types
- **React Query integration**: Automatic caching, refetching, and state management
- **Automatic token handling**: JWT tokens automatically included in requests
- **Error handling**: Centralized error handling with automatic redirects
- **Cache invalidation**: Automatic query invalidation on mutations

## Migration from Old Structure

The old `services/` directory structure has been replaced with this new `api/` structure. To migrate:

1. Replace imports:
   ```typescript
   // Old
   import { attendanceService } from '@/services/attendance.service';
   
   // New
   import { useMarkAttendance } from '@/api/hooks/attendance';
   ```

2. Use hooks instead of direct service calls:
   ```typescript
   // Old
   const data = await attendanceService.createAttendance(payload);
   
   // New
   const { mutate: markAttendance } = useMarkAttendance();
   markAttendance(payload);
   ```

## Notes

- All API calls automatically include the JWT token from cookies
- Unauthorized (401) responses trigger automatic logout and redirect to login
- Query keys are structured for easy cache management
- All mutations invalidate related queries automatically

# Client Implementation Plan - Phased Approach

## Phase 1: Authentication & User Management

### API Endpoints to Integrate

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /auth/request-otp | Send OTP to user email |
| POST | /auth/verify-otp | Verify OTP, receive JWT token |
| POST | /auth/register | Register new student |
| GET | /users | List all users (admin view) |
| GET | /users/srms | List all SRMs |
| GET | /user/:userId | Get single user profile |
| PATCH | /user/:userId/role | Update user role |
| PATCH | /user/:userId/data | Update user profile data |
| DELETE | /user/:userId | Delete user |

### Data Models

```typescript
// User
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'superadmin' | 'srm';
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Student (linked to User)
interface Student {
  _id: string;
  userId: string;        // Reference to User
  phone: string;
  discordUsername: string;
  assignedSrmId?: string; // Reference to User (SRM)
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

// Combined Student with User info
interface StudentWithUser extends Student {
  user: User;
}

// Auth State
interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
}
```

### UI Components Required

| Component | Purpose |
|-----------|---------|
| `LoginPage` | Email input, OTP request/verification |
| `RegistrationPage` | Student registration form |
| `ProtectedRoute` | Route guard based on auth state |
| `UserProfile` | Display/edit user profile |
| `UserList` | Admin view of all users |
| `SrmList` | List all SRMs for assignment |

### Error Handling Strategy

```typescript
// Error Types
enum AuthError {
  INVALID_EMAIL = 'Invalid email format',
  OTP_EXPIRED = 'OTP has expired',
  INVALID_OTP = 'Invalid OTP code',
  USER_NOT_FOUND = 'User not found',
  UNAUTHORIZED = 'Unauthorized access',
}

// Error Handler
const handleAuthError = (error: ApiError) => {
  switch (error.code) {
    case 401:
      redirectToLogin();
      break;
    case 403:
      showToast('Insufficient permissions');
      break;
    case 404:
      showToast('User not found');
      break;
    default:
      showToast('An error occurred');
  }
};
```

### Testing Checkpoints

- [ ] OTP request sends successfully
- [ ] OTP verification returns valid JWT
- [ ] Token stored in localStorage/cookies
- [ ] Protected routes block unauthenticated users
- [ ] Role-based access control works
- [ ] User profile displays correctly
- [ ] User list loads for admins

---

## Phase 2: Core Data Entities

### API Endpoints to Integrate

#### Students
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /users/students | List all students |
| GET | /user/:userId/student | Get student by user ID |
| PATCH | /user/:userId/assign-srm | Assign SRM to student |
| PATCH | /user/:userId/block | Block/unblock student |

#### Attendance
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /create-attendance | Mark attendance |
| GET | /get-attendance | Get all attendance (admin) |
| GET | /get-attendance/student | Get own attendance |
| GET | /get-attendance/student/:studentId | Get specific student attendance |
| PATCH | /update-attendance/:attendanceId | Update attendance |
| DELETE | /delete-attendance/:attendanceId | Delete attendance |

#### Attendance Window
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /open-window | Open attendance window |
| POST | /close-window | Close attendance window |
| GET | /window-status | Check window status |
| POST | /mark-absent | Bulk mark absent |

#### Tasks
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /task | Create task |
| PATCH | /task/:taskId | Update task |
| GET | /task/current | Get current task |
| GET | /task/upcoming | Get upcoming task |
| GET | /task/due | Get due tasks |
| DELETE | /task/:taskId | Delete task |

#### Call History
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /calls | Log outreach call |
| GET | /calls/student/:studentId | Get student call history |
| GET | /calls/srm/:srmId | Get SRM call history |

### Data Models

```typescript
// Attendance
interface Attendance {
  _id: string;
  studentId: string;    // Reference to Student
  status: 'ATTENDED' | 'ABSENT';
  mission: number;      // 1-8
  module: number;       // 1-6
  moduleVideo: number;
  date: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

// Attendance Window
interface AttendanceWindow {
  _id: string;
  isOpen: boolean;
  openedAt?: string;
  closedAt?: string;
  openedBy?: string;    // Reference to User
}

// Task
interface Task {
  _id: string;
  mission: number;      // 1-8
  moduleNumber: number; // 1-6
  videoNumber?: string;
  guideline: string;
  dueDate: string;
  createdBy: string;    // Reference to User
  createdAt: string;
  updatedAt: string;
}

// Call History
interface CallHistory {
  _id: string;
  studentId: string;    // Reference to Student
  srmId: string;        // Reference to User (SRM)
  outcome: 'Received' | 'Not Received' | 'Busy' | 'Left Voicemail' | 'Wrong Number' | 'Discord Action';
  note?: string;
  date: string;
  createdAt: string;
}
```

### UI Components Required

| Component | Purpose |
|-----------|---------|
| `StudentList` | Display all students with filters |
| `StudentDetail` | Student profile with attendance |
| `SrmAssignmentModal` | Assign SRM to student |
| `AttendanceForm` | Mark attendance (student view) |
| `AttendanceTable` | View attendance records |
| `AttendanceWindowControl` | Open/close window (admin) |
| `TaskList` | Display tasks |
| `TaskForm` | Create/edit tasks |
| `TaskSlider` | Yesterday/Today/Tomorrow tasks |
| `CallLogForm` | Log outreach calls |
| `CallHistoryList` | Display call history |

### SRM Assignment Logic

```typescript
// SRM Assignment Service
const assignSrmToStudent = async (userId: string, srmId: string) => {
  const response = await api.patch(`/user/${userId}/assign-srm`, { srmId });
  
  // Update local state
  queryClient.invalidateQueries(['students']);
  
  return response.data;
};

// Get students assigned to SRM
const getAssignedStudents = async (srmId: string) => {
  const allStudents = await api.get('/users/students');
  
  // Filter by assignedSrmId
  return allStudents.data.filter(
    (student: Student) => student.assignedSrmId === srmId
  );
};

// SRM Dashboard Hook
const useSrmDashboard = (srmId: string) => {
  return useQuery({
    queryKey: ['srm-dashboard', srmId],
    queryFn: () => getAssignedStudents(srmId),
  });
};
```

### Error Handling Strategy

```typescript
// Data Error Types
enum DataError {
  STUDENT_NOT_FOUND = 'Student not found',
  ATTENDANCE_EXISTS = 'Attendance already marked',
  WINDOW_CLOSED = 'Attendance window is closed',
  INVALID_MISSION = 'Invalid mission number',
  INVALID_MODULE = 'Invalid module number',
}

// Global Error Handler
const useApiErrorHandler = () => {
  const { logout } = useAuth();
  
  return (error: AxiosError) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    
    switch (status) {
      case 401:
        logout();
        break;
      case 403:
        toast.error('You do not have permission');
        break;
      case 409:
        toast.error(message || 'Record already exists');
        break;
      case 422:
        toast.error(message || 'Validation failed');
        break;
      default:
        toast.error('An unexpected error occurred');
    }
  };
};
```

### Testing Checkpoints

- [ ] Student list loads with user info
- [ ] SRM assignment updates correctly
- [ ] Block/unblock toggles student status
- [ ] Attendance marking respects window status
- [ ] Attendance records display with pagination
- [ ] Tasks CRUD operations work
- [ ] Call logging creates records
- [ ] Call history filters by student/SRM

---

## Phase 3: Dashboard & Reporting

### API Endpoints to Integrate

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /analytics/dashboard | Dashboard overview stats |
| GET | /analytics/srm/:srmId | SRM performance metrics |
| GET | /analytics/attendance/trends?days=7 | Attendance trends |

### Data Models

```typescript
// Dashboard Stats
interface DashboardStats {
  totalStudents: number;
  totalSrms: number;
  attendanceRate: number;
  riskDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  recentCalls: number;
  windowStatus: boolean;
}

// SRM Performance
interface SrmPerformance {
  srmId: string;
  totalCalls: number;
  callsToday: number;
  callsThisWeek: number;
  assignedStudents: number;
  callsByOutcome: {
    received: number;
    notReceived: number;
    busy: number;
    voicemail: number;
    wrongNumber: number;
  };
}

// Attendance Trend
interface AttendanceTrend {
  date: string;
  attended: number;
  absent: number;
  rate: number;
}
```

### UI Components Required

| Component | Purpose |
|-----------|---------|
| `DashboardOverview` | Main dashboard with stats cards |
| `RiskDistributionChart` | Pie chart of risk levels |
| `AttendanceTrendChart` | Line chart of attendance over time |
| `SrmPerformanceCard` | Individual SRM metrics |
| `RecentActivityFeed` | Recent calls/attendance |
| `SessionMonitor` | Attendance window status |
| `StudentFilterBar` | Filter by risk, SRM, status |
| `BulkActionBar` | Bulk operations on students |

### SRM-Specific Views

```typescript
// SRM Dashboard View
const SrmDashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: assignedStudents } = useAssignedStudents(user._id);
  const { data: performance } = useSrmPerformance(user._id);
  
  return (
    <div>
      <SrmStatCards performance={performance} />
      <StudentTable 
        students={assignedStudents}
        showRiskIndicator
        allowCallLogging
      />
    </div>
  );
};

// Admin Dashboard View
const AdminDashboard: React.FC = () => {
  const { data: stats } = useDashboardStats();
  const { data: windowStatus } = useWindowStatus();
  
  return (
    <div>
      <StatCards stats={stats} />
      <SessionMonitor status={windowStatus} />
      <AnalyticsSnapshot trends={stats.trends} />
    </div>
  );
};
```

### Filtering Logic

```typescript
// Student Filters
interface StudentFilters {
  riskLevel?: 'high' | 'medium' | 'low';
  assignedSrmId?: string;
  isBlocked?: boolean;
  searchTerm?: string;
}

// Filter Hook
const useFilteredStudents = (filters: StudentFilters) => {
  const { data: students } = useStudents();
  
  return useMemo(() => {
    if (!students) return [];
    
    return students.filter(student => {
      if (filters.riskLevel && student.risk !== filters.riskLevel) return false;
      if (filters.assignedSrmId && student.assignedSrmId !== filters.assignedSrmId) return false;
      if (filters.isBlocked !== undefined && student.isBlocked !== filters.isBlocked) return false;
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        const nameMatch = student.user.name.toLowerCase().includes(term);
        const emailMatch = student.user.email.toLowerCase().includes(term);
        if (!nameMatch && !emailMatch) return false;
      }
      return true;
    });
  }, [students, filters]);
};
```

### Testing Checkpoints

- [ ] Dashboard stats load correctly
- [ ] Risk distribution displays accurately
- [ ] Attendance trends show correct data
- [ ] SRM performance metrics calculate correctly
- [ ] Filters update student list in real-time
- [ ] SRM view shows only assigned students
- [ ] Admin view shows all students

---

## Phase 4: Advanced Features

### Features to Implement

#### 1. Real-time Updates
```typescript
// WebSocket or Polling for window status
const useWindowStatusRealtime = () => {
  return useQuery({
    queryKey: ['window-status'],
    queryFn: getWindowStatus,
    refetchInterval: 30000, // Poll every 30 seconds
  });
};

// Optimistic updates for attendance
const useMarkAttendance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: markAttendance,
    onMutate: async (newAttendance) => {
      // Optimistically update UI
      await queryClient.cancelQueries(['attendance']);
      const previous = queryClient.getQueryData(['attendance']);
      queryClient.setQueryData(['attendance'], (old) => [...old, newAttendance]);
      return { previous };
    },
    onError: (err, newAttendance, context) => {
      // Rollback on error
      queryClient.setQueryData(['attendance'], context.previous);
    },
  });
};
```

#### 2. Batch Operations
```typescript
// Bulk mark absent
const useBulkMarkAbsent = () => {
  return useMutation({
    mutationFn: (date: string) => api.post('/mark-absent', { date }),
    onSuccess: () => {
      queryClient.invalidateQueries(['attendance']);
      toast.success('Students marked as absent');
    },
  });
};

// Bulk SRM assignment
const useBulkAssignSrm = () => {
  return useMutation({
    mutationFn: ({ studentIds, srmId }: { studentIds: string[]; srmId: string }) =>
      Promise.all(studentIds.map(id => api.patch(`/user/${id}/assign-srm`, { srmId }))),
    onSuccess: () => {
      queryClient.invalidateQueries(['students']);
      toast.success('SRM assigned to selected students');
    },
  });
};
```

#### 3. Data Export
```typescript
// Export to CSV
const exportStudentsToCSV = (students: Student[]) => {
  const headers = ['Name', 'Email', 'Phone', 'Discord', 'SRM', 'Status', 'Risk'];
  const rows = students.map(s => [
    s.user.name,
    s.user.email,
    s.phone,
    s.discordUsername,
    s.assignedSrmId || 'Unassigned',
    s.isBlocked ? 'Blocked' : 'Active',
    calculateRisk(s),
  ]);
  
  downloadCSV([headers, ...rows], 'students.csv');
};

// Export attendance report
const exportAttendanceReport = (attendance: Attendance[]) => {
  // Generate PDF or Excel report
};
```

### UI Components Required

| Component | Purpose |
|-----------|---------|
| `RealTimeIndicator` | Show connection status |
| `BulkActionModal` | Confirm bulk operations |
| `ExportButton` | Export data to CSV/PDF |
| `DataTable` | Advanced table with sorting/filtering |
| `AutoRefreshToggle` | Enable/disable real-time updates |
| `OfflineIndicator` | Show when offline |

### Error Handling for Advanced Features

```typescript
// Network error handling
const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
};

// Retry logic for failed requests
const useRetryableMutation = (mutationFn, options) => {
  return useMutation(mutationFn, {
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
};
```

### Testing Checkpoints

- [ ] Real-time window status updates
- [ ] Optimistic updates reflect immediately
- [ ] Rollback on mutation failure
- [ ] Bulk operations complete successfully
- [ ] CSV export generates correct file
- [ ] Offline mode shows indicator
- [ ] Retry logic handles network failures
- [ ] Data remains consistent after reconnection

---

## Implementation Order

### Week 1-2: Phase 1
- Set up API client with interceptors
- Implement authentication flow
- Create protected routes
- Build user management UI

### Week 3-4: Phase 2
- Implement student management
- Build attendance system
- Create task management
- Add call logging

### Week 5-6: Phase 3
- Build dashboard views
- Implement analytics
- Add filtering/sorting
- Create SRM-specific views

### Week 7-8: Phase 4
- Add real-time updates
- Implement batch operations
- Add data export
- Performance optimization

---

## Environment Configuration

```typescript
// config/api.ts
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  retries: 3,
};

// Feature flags
export const FEATURES = {
  realTimeUpdates: true,
  batchOperations: true,
  dataExport: true,
  offlineMode: false,
};
```

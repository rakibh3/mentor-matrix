import type { CallOutcome } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { logCall } from '@/api/endpoints/call-history';
import { useToast } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StudentRecord = Record<string, any>;

// Helper to update student data whether it's an array or a response object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateStudentData = (
  oldData: any,
  updateFn: (students: StudentRecord[]) => StudentRecord[]
) => {
  if (!oldData) return oldData;
  if (Array.isArray(oldData)) {
    return updateFn(oldData);
  }
  if (oldData.data && Array.isArray(oldData.data)) {
    return {
      ...oldData,
      data: updateFn(oldData.data),
    };
  }
  return oldData;
};

/**
 * Custom hook for toggling student block status
 * @param queryKey - The query key to invalidate/update after mutation
 * @param idField - The field to use as identifier ('id' or 'email')
 */
export function useToggleBlock(queryKey: string, idField: 'id' | 'email' | '_id' = 'id') {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (identifier: string) => identifier,
    onSuccess: (identifier) => {
      let isNowBlocked = false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData([queryKey], (old: any) => {
        return updateStudentData(old, (students) => {
          return students.map((s) => {
            if (s[idField] === identifier) {
              isNowBlocked = !s.isBlocked;
              return { ...s, isBlocked: isNowBlocked };
            }
            return s;
          });
        });
      });
      addToast({
        type: isNowBlocked ? 'warning' : 'success',
        title: isNowBlocked ? 'Student Blocked' : 'Student Unblocked',
        message: `Student access has been ${isNowBlocked ? 'restricted' : 'restored'}.`,
      });
    },
  });
}

/**
 * Custom hook for toggling student assignment completion
 * @param queryKey - The query key to invalidate/update after mutation
 * @param idField - The field to use as identifier ('id' or 'email')
 */
export function useToggleAssignment(queryKey: string, idField: 'id' | 'email' | '_id' = 'id') {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ identifier, assignment }: { identifier: string; assignment: string }) => {
      return { identifier, assignment };
    },
    onSuccess: ({ identifier, assignment }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData([queryKey], (old: any) => {
        return updateStudentData(old, (students) => {
          return students.map((s) => {
            if (s[idField] !== identifier) return s;
            const completedAssignments = s.completedAssignments as string[] | undefined;
            const isAlreadyCompleted = completedAssignments?.includes(assignment);
            const newCompletions = isAlreadyCompleted
              ? (completedAssignments ?? []).filter((a: string) => a !== assignment)
              : [...(completedAssignments || []), assignment];
            return { ...s, completedAssignments: newCompletions };
          });
        });
      });
    },
  });
}

/**
 * Custom hook for logging calls to students
 * @param queryKey - The query key to invalidate/update after mutation
 * @param idField - The field to use as identifier ('id' or 'email')
 */
export function useLogCall(queryKey: string, idField: 'id' | 'email' | '_id' = 'id') {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      studentId,
      outcome,
      note,
    }: {
      studentId: string;
      outcome: CallOutcome;
      note?: string;
    }) => {
      // Map frontend outcome to backend status
      let status: 'COMPLETED' | 'NO_ANSWER' | 'BUSY' | 'FAILED' | 'SCHEDULED' | 'FOREIGN_NUMBER' = 'COMPLETED';

      switch (outcome) {
        case 'Received':
          status = 'COMPLETED';
          break;
        case 'Not Received':
          status = 'NO_ANSWER';
          break;
        case 'Busy':
          status = 'BUSY';
          break;
        case 'Foreign Number':
        case 'Wrong Number':
          status = outcome === 'Foreign Number' ? 'FOREIGN_NUMBER' : 'FAILED';
          break;
        default:
          status = 'COMPLETED';
      }

      if (!user?._id) {
        throw new Error('User not authenticated');
      }

      // Use the real API endpoint with corrected payload
      const response = await logCall({
        student: studentId,
        calledBy: user._id,
        callType: 'FOLLOW_UP', // Defaulting to FOLLOW_UP as per current UI context
        status,
        notes: note,
      });

      return {
        studentId,
        outcome,
        note,
        callData: response.data,
      };
    },
    onSuccess: (data) => {
      const now = new Date();
      // If we have real data from server, use its date, otherwise fallback to local time
      const dateToDisplay = data.callData?.createdAt ? new Date(data.callData.createdAt) : now;
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      const formattedDate = `${dateToDisplay.getDate()} ${months[dateToDisplay.getMonth()]}`;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData([queryKey], (old: any) => {
        return updateStudentData(old, (students) => {
          return students.map((s) => {
            // Check against both idField and _id to be safe
            if (s[idField] === data.studentId || s._id === data.studentId) {
              const currentHistory = (s.callHistory as unknown[]) || [];
              const currentCount = (s.callCount as number) || 0;
              return {
                ...s,
                callCount: currentCount + 1,
                callHistory: [
                  {
                    date: formattedDate,
                    outcome: data.outcome,
                    note: data.note,
                  },
                  ...currentHistory,
                ],
              };
            }
            return s;
          });
        });
      });
    },
  });
}

/**
 * Custom hook for editing student data
 * @param queryKey - The query key to invalidate/update after mutation
 * @param idField - The field to use as identifier ('id' or 'email')
 */
export function useEditStudent<T extends StudentRecord = StudentRecord>(
  queryKey: string,
  idField: 'id' | 'email' | '_id' = 'id'
) {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (updated: T) => updated,
    onSuccess: (data) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData([queryKey], (old: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return updateStudentData(old, (students: any[]) => {
          return students.map((s) => (s[idField] === data[idField] ? { ...s, ...data } : s));
        });
      });
      addToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Student information has been successfully updated.',
      });
    },
  });
}

/**
 * Custom hook for deleting student
 * @param queryKey - The query key to invalidate/update after mutation
 * @param idField - The field to use as identifier ('id' or 'email')
 */
export function useDeleteStudent(queryKey: string, idField: 'id' | 'email' | '_id' = 'id') {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (identifier: string) => identifier,
    onSuccess: (identifier) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData([queryKey], (old: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return updateStudentData(old, (students: any[]) => {
          return students.filter((s) => s[idField] !== identifier);
        });
      });
      addToast({
        type: 'info',
        title: 'Record Removed',
        message: 'Student has been removed from the system.',
      });
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDateTimeDisplay } from '@/utils/dateUtils';
import { useToast } from '@/components/ui/use-toast';
import type { CallOutcome } from '@/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StudentRecord = Record<string, any>;

/**
 * Custom hook for toggling student block status
 * @param queryKey - The query key to invalidate/update after mutation
 * @param idField - The field to use as identifier ('id' or 'email')
 */
export function useToggleBlock(queryKey: string, idField: 'id' | 'email' = 'id') {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (identifier: string) => identifier,
    onSuccess: (identifier) => {
      let isNowBlocked = false;
      queryClient.setQueryData([queryKey], (old: StudentRecord[] | undefined) => {
        return old?.map((s) => {
          if (s[idField] === identifier) {
            isNowBlocked = !s.isBlocked;
            return { ...s, isBlocked: isNowBlocked };
          }
          return s;
        });
      });
      addToast({ 
        type: isNowBlocked ? 'warning' : 'success', 
        title: isNowBlocked ? 'Student Blocked' : 'Student Unblocked', 
        message: `Student access has been ${isNowBlocked ? 'restricted' : 'restored'}.` 
      });
    }
  });
}

/**
 * Custom hook for toggling student assignment completion
 * @param queryKey - The query key to invalidate/update after mutation
 * @param idField - The field to use as identifier ('id' or 'email')
 */
export function useToggleAssignment(queryKey: string, idField: 'id' | 'email' = 'id') {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ identifier, assignment }: { identifier: string, assignment: string }) => {
      return { identifier, assignment };
    },
    onSuccess: ({ identifier, assignment }) => {
      queryClient.setQueryData([queryKey], (old: StudentRecord[] | undefined) => {
        return old?.map((s) => {
          if (s[idField] !== identifier) return s;
          const completedAssignments = s.completedAssignments as string[] | undefined;
          const isAlreadyCompleted = completedAssignments?.includes(assignment);
          const newCompletions = isAlreadyCompleted 
            ? (completedAssignments ?? []).filter((a: string) => a !== assignment)
            : [...(completedAssignments || []), assignment];
          return { ...s, completedAssignments: newCompletions };
        });
      });
    }
  });
}

/**
 * Custom hook for logging calls to students
 * @param queryKey - The query key to invalidate/update after mutation
 * @param idField - The field to use as identifier ('id' or 'email')
 */
export function useLogCall(queryKey: string, idField: 'id' | 'email' = 'id') {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ studentId, outcome }: { studentId: string, outcome: CallOutcome }) => {
      return { studentId, outcome };
    },
    onSuccess: (data) => {
      const now = new Date();
      const formattedDate = formatDateTimeDisplay(now);
      
      queryClient.setQueryData([queryKey], (old: StudentRecord[] | undefined) => {
        return old?.map((s) => {
          if (s[idField] === data.studentId) {
            const currentHistory = (s.callHistory as unknown[]) || [];
            const currentCount = (s.callCount as number) || 0;
            return { 
              ...s, 
              callCount: currentCount + 1, 
              callHistory: [{ date: formattedDate, outcome: data.outcome }, ...currentHistory] 
            }; 
          }
          return s;
        });
      });
    }
  });
}

/**
 * Custom hook for editing student data
 * @param queryKey - The query key to invalidate/update after mutation
 * @param idField - The field to use as identifier ('id' or 'email')
 */
export function useEditStudent<T extends StudentRecord = StudentRecord>(queryKey: string, idField: 'id' | 'email' = 'id') {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (updated: T) => updated,
    onSuccess: (data) => {
      queryClient.setQueryData([queryKey], (old: T[] | undefined) => {
        return old?.map((s) => s[idField] === data[idField] ? { ...s, ...data } : s);
      });
      addToast({ 
        type: 'success', 
        title: 'Profile Updated', 
        message: 'Student information has been successfully updated.' 
      });
    }
  });
}

/**
 * Custom hook for deleting student
 * @param queryKey - The query key to invalidate/update after mutation  
 * @param idField - The field to use as identifier ('id' or 'email')
 */
export function useDeleteStudent(queryKey: string, idField: 'id' | 'email' = 'id') {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (identifier: string) => identifier,
    onSuccess: (identifier) => {
      queryClient.setQueryData([queryKey], (old: StudentRecord[] | undefined) => {
        return old?.filter((s) => s[idField] !== identifier);
      });
      addToast({ 
        type: 'info', 
        title: 'Record Removed', 
        message: 'Student has been removed from the system.' 
      });
    }
  });
}

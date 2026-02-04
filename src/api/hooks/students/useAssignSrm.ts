// useAssignSrm - Hook for assigning SRM to student
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { assignSrmToStudent } from '@/api/endpoints/students';
import type {
  AssignSrmRequest,
  AssignSrmResponse,
} from '@/api/types/student.types';

interface AssignSrmParams {
  userId: string;
  data: AssignSrmRequest;
}

export const useAssignSrm = () => {
  const queryClient = useQueryClient();

  return useMutation<AssignSrmResponse, Error, AssignSrmParams>({
    mutationFn: ({ userId, data }) => assignSrmToStudent(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student'] });
    },
  });
};

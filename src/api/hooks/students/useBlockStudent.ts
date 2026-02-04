// useBlockStudent - Hook for blocking/unblocking student
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { blockStudent } from '@/api/endpoints/students';
import type {
  BlockStudentRequest,
  BlockStudentResponse,
} from '@/api/types/student.types';

interface BlockStudentParams {
  userId: string;
  data: BlockStudentRequest;
}

export const useBlockStudent = () => {
  const queryClient = useQueryClient();

  return useMutation<BlockStudentResponse, Error, BlockStudentParams>({
    mutationFn: ({ userId, data }) => blockStudent(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student'] });
    },
  });
};

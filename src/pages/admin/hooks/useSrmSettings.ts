import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  sendOutreachEmail,
  type SendEmailRequest,
} from '@/api/endpoints/email';
import { updateMyProfile } from '@/api/endpoints/users';
import type { UpdateUserDataRequest } from '@/api/types/user.types';
import { useToast } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: (data: UpdateUserDataRequest) => updateMyProfile(data),
    onSuccess: (response) => {
      if (response.data) {
        updateUser(response.data);
      }
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      addToast({
        type: 'success',
        title: 'Settings Saved',
        message: response.message || 'Your settings have been updated.',
      });
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Failed to Save',
        message: error.response?.data?.message || 'Could not save settings.',
      });
    },
  });
}

export function useSendOutreachEmail() {
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (data: SendEmailRequest) => sendOutreachEmail(data),
    onSuccess: () => {
      addToast({
        type: 'success',
        title: 'Email Sent',
        message: 'Outreach email has been sent successfully.',
      });
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Email Failed',
        message: error.response?.data?.message || 'Could not send email.',
      });
    },
  });
}

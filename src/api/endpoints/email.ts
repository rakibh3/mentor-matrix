import apiClient from '@/api/client/axios';

export interface SendEmailRequest {
  to: string;
  subject: string;
  body: string;
}

export interface SendEmailResponse {
  success: boolean;
  message: string;
}

/**
 * Send outreach email (POST /email/send-outreach)
 */
export const sendOutreachEmail = async (data: SendEmailRequest): Promise<SendEmailResponse> => {
  const response = await apiClient.post<SendEmailResponse>('/email/send-outreach', data);
  return response.data;
};

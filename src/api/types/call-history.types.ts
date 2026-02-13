// Call History Types based on server/src/modules/call-history/call-history.interface.ts

export type CallOutcome =
  | 'Received'
  | 'Not Received'
  | 'Busy'
  | 'Left Voicemail'
  | 'Wrong Number'
  | 'Discord Action';

export interface CallHistory {
  _id: string;
  studentId: string;
  srmId: string;
  outcome: CallOutcome;
  note?: string;
  date: string;
  createdAt?: string;
}

export interface CallHistoryWithDetails extends CallHistory {
  student?: {
    _id: string;
    name: string;
    email: string;
  };
  srm?: {
    _id: string;
    name: string;
  };
}

// Request types
export interface LogCallRequest {
  student: string;
  calledBy: string;
  callType: 'FOLLOW_UP' | 'REMINDER' | 'SUPPORT' | 'FEEDBACK';
  status: 'COMPLETED' | 'NO_ANSWER' | 'BUSY' | 'FAILED' | 'SCHEDULED';
  notes?: string;
  duration?: number;
  scheduledAt?: Date;
  calledAt?: Date;
}

// Response types
export interface LogCallResponse {
  success: boolean;
  message: string;
  data?: CallHistory;
}

export interface GetCallHistoryResponse {
  success: boolean;
  data: {
    student: any;
    calls: CallHistoryWithDetails[];
    totalCalls: number;
  };
}

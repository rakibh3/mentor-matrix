export type CallOutcome = 'Received' | 'Not Received' | 'Busy' | 'Left Voicemail' | 'Wrong Number' | 'Discord Action';

export interface CallRecord {
  date: string;
  outcome: CallOutcome;
  note?: string;
}

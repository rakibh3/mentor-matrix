export type CallOutcome = 'Received' | 'Not Received' | 'Busy' | 'Foreign Number' | 'Wrong Number' | 'Discord Action';

export interface CallRecord {
  date: string;
  outcome: CallOutcome;
  note?: string;
}

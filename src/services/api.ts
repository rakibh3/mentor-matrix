import { STUDENTS, ATTENDANCE, TASKS, FLAGGED_STUDENTS } from '@/data/mockData';
import type { FlaggedStudent, Task, AttendanceRecord } from '@/types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchStudents = async (): Promise<unknown[]> => {
  await sleep(400); // Simulate network delay
  return STUDENTS;
};

export const fetchAttendance = async (): Promise<AttendanceRecord[]> => {
  await sleep(300);
  return ATTENDANCE;
};

export const fetchTasks = async (): Promise<Task[]> => {
  await sleep(500);
  return TASKS;
};

export const fetchFlaggedStudents = async (): Promise<FlaggedStudent[]> => {
  await sleep(450);
  return FLAGGED_STUDENTS;
};

// Default export for generic use if needed
export default {
  fetchStudents,
  fetchAttendance,
  fetchTasks,
  fetchFlaggedStudents
};
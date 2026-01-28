export type UserRole = 'admin' | 'student' | 'superadmin';

export interface User {
  email: string;
  role: UserRole;
  name?: string;
  discord?: string;
  id?: string;
}

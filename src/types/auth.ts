export type UserRole = 'ADMIN' | 'STUDENT' | 'SUPER_ADMIN' | 'SRM' | 'admin' | 'student' | 'superadmin';

export interface User {
  email: string;
  role: UserRole;
  name?: string;
  discord?: string;
  id?: string;
  smtpConfig?: {
    appPassword?: string;
  };
}

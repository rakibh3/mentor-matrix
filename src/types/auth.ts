export type UserRole =
  | 'ADMIN'
  | 'STUDENT'
  | 'SUPER_ADMIN'
  | 'SRM'
  | 'admin'
  | 'student'
  | 'superadmin'
  | 'srm';

export interface User {
  _id?: string;
  id?: string;
  email: string;
  role: UserRole;
  name?: string;
  discord?: string;
  smtpConfig?: {
    appPassword?: string;
  };
}

export type UserRole = 'customer' | 'admin';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  role: UserRole;
  emailVerified: boolean;
  createdAt?: unknown;
}
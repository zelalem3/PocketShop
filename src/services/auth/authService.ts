import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
  User,
} from '@react-native-firebase/auth';

import { auth } from '../../config/firebase';
import { AppUser } from '../../types/user';

const mapFirebaseUser = (user: User): AppUser => {
  return {
    uid: user.uid,
    email: user.email ?? '',
    displayName: user.displayName,
    phoneNumber: user.phoneNumber,
    photoURL: user.photoURL,
    role: 'customer',
    emailVerified: user.emailVerified,
  };
};

export const register = async (
  email: string,
  password: string,
  displayName: string,
): Promise<AppUser> => {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );

  const user = credential.user;

  await updateProfile(user, {
    displayName: displayName.trim(),
  });

  await sendEmailVerification(user);

  return mapFirebaseUser(user);
};
export const reloadCurrentUser = async (): Promise<AppUser | null> => {
  const user = auth.currentUser;

  if (!user) {
    return null;
  }

  await user.reload();

  return mapFirebaseUser(user);
};
export const resendVerificationEmail = async (): Promise<void> => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('You must be signed in.');
  }

  if (user.emailVerified) {
    return;
  }

  await sendEmailVerification(user);
};

export const login = async (
  email: string,
  password: string,
): Promise<AppUser> => {
  const credential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );

  return mapFirebaseUser(credential.user);
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};

export const resetPassword = async (
  email: string,
): Promise<void> => {
  await sendPasswordResetEmail(auth, email.trim());
};

export const getCurrentUser = (): AppUser | null => {
  const user = auth.currentUser;

  if (!user) {
    return null;
  }

  return mapFirebaseUser(user);
};

export const isAuthenticated = (): boolean => {
  return auth.currentUser !== null;
};
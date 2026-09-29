import { create } from 'zustand';
import { onAuthStateChanged, User } from '@react-native-firebase/auth';

import { auth } from '../config/firebase';
import {
  login as loginUser,
  logout as logoutUser,
  register as registerUser,
  resetPassword as resetPasswordUser,
} from '../services/auth/authService';
import { AppUser } from '../types/user';

interface AuthState {
  user: AppUser | null;
  loading: boolean;
  initialized: boolean;

  initialize: () => () => void;

  login: (email: string, password: string) => Promise<void>;

  register: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<void>;

  logout: () => Promise<void>;

  resetPassword: (email: string) => Promise<void>;
}

const mapFirebaseUser = (user: User): AppUser => ({
  uid: user.uid,
  email: user.email ?? '',
  displayName: user.displayName,
  phoneNumber: user.phoneNumber,
  photoURL: user.photoURL,
  role: 'customer',
  emailVerified: user.emailVerified,
});

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialized: false,

  initialize: () => {
    const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
      set({
        user: firebaseUser ? mapFirebaseUser(firebaseUser) : null,
        loading: false,
        initialized: true,
      });
    });

    return unsubscribe;
  },

  login: async (email, password) => {
    set({ loading: true });

    try {
      await loginUser(email, password);
    } finally {
      set({ loading: false });
    }
  },

  register: async (email, password, displayName) => {
    set({ loading: true });

    try {
      await registerUser(email, password, displayName);
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });

    try {
      await logoutUser();
    } finally {
      set({
        user: null,
        loading: false,
      });
    }
  },

  resetPassword: async email => {
    await resetPasswordUser(email);
  },
}));
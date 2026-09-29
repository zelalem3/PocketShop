import { getApp, getApps, initializeApp } from '@react-native-firebase/app';
import {
  getAuth,
} from '@react-native-firebase/auth';

const firebaseApp = getApps().length === 0 ? initializeApp() : getApp();

export const auth = getAuth(firebaseApp);

export default firebaseApp;
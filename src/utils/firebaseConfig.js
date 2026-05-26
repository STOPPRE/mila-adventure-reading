import { initializeApp } from 'firebase/app';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Firebase configuration for the vera-family-apps project.
const firebaseConfig = {
  projectId: 'vera-family-apps',
  authDomain: 'vera-family-apps.firebaseapp.com',
  storageBucket: 'vera-family-apps.appspot.com',
  messagingSenderId: '554239999085',
  appId: '1:554239999085:web:mock-app-id'
};

const app = initializeApp(firebaseConfig);
export const functions = getFunctions(app);

// Route to local Firebase Functions Emulator if VITE_USE_FIREBASE_EMULATOR is enabled
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  connectFunctionsEmulator(functions, 'localhost', 5001);
}
export default app;

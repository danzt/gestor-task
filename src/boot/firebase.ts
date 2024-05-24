import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig: Record<string, unknown> = {
  apiKey: 'AIzaSyAQlUYlNfjkJD13_E-Ok-K3dyhfirExX1U',
  authDomain: 'task-gestor-e6603.firebaseapp.com',
  projectId: 'task-gestor-e6603',
  storageBucket: 'task-gestor-e6603.appspot.com',
  messagingSenderId: '467077611957',
  appId: '1:467077611957:web:87648dee044ad3c56ad9fc',
  measurementId: 'G-P8KDSCP5QM'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

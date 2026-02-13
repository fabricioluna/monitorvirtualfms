import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBv...", // Substitua pela sua chave completa se necessário
  authDomain: "monitor-virtual-fms.firebaseapp.com",
  databaseURL: "https://monitor-virtual-fms-default-rtdb.firebaseio.com",
  projectId: "monitor-virtual-fms",
  storageBucket: "monitor-virtual-fms.appspot.com",
  messagingSenderId: "833897320265",
  appId: "1:833897320265:web:8c5166468498f828a1c977"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

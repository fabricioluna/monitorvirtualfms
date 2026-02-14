import { initializeApp } from "firebase/app";
import { 
  getDatabase, 
  ref, 
  onValue, 
  push, 
  remove, 
  set, 
  update,
  off 
} from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "monitor-virtual-fms.firebaseapp.com",
  databaseURL: "https://monitor-virtual-fms-default-rtdb.firebaseio.com",
  projectId: "monitor-virtual-fms",
  storageBucket: "monitor-virtual-fms.firebasestorage.app",
  messagingSenderId: "560311360671",
  appId: "1:560311360671:web:24fd3c03c865a11e0256aa",
  measurementId: "G-GJW5RPXJ1S"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Analytics apenas no cliente
if (typeof window !== "undefined") {
  getAnalytics(app);
}

// Exporta o banco de dados
export const db = getDatabase(app);

// Exporta as funções do banco de dados para que o App.tsx as encontre
export { ref, onValue, push, remove, set, update, off };

export default app;

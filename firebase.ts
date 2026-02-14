import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  // Aqui usamos a variável de ambiente para proteger sua chave
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

// Inicializa o Analytics apenas se estiver no navegador
if (typeof window !== "undefined") {
  getAnalytics(app);
}

// Exporta o Database para ser usado no restante do app
export const db = getDatabase(app);
export default app;

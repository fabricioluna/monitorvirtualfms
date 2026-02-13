
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA_1Yjc5ez_9movyA4sGPM8z-9BZ3oeiLU",
  authDomain: "monitor-virtual-fms.firebaseapp.com",
  databaseURL: "https://monitor-virtual-fms-default-rtdb.firebaseio.com",
  projectId: "monitor-virtual-fms",
  storageBucket: "monitor-virtual-fms.firebasestorage.app",
  messagingSenderId: "560311360671",
  appId: "1:560311360671:web:24fd3c03c865a11e0256aa"
};

let db: any = null;

try {
  // Inicialização segura
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  db = getDatabase(app);
  console.log("🔥 Firebase: Serviço carregado.");
} catch (error) {
  console.error("🚨 Erro crítico no Firebase. O app iniciará em modo offline.", error);
}

export { db, ref, onValue, set, push, remove };

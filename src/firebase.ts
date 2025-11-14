import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FBAPI,
  authDomain: "assignment4-371-mattkeuning.firebaseapp.com",
  projectId: "assignment4-371-mattkeuning",
  storageBucket: "assignment4-371-mattkeuning.firebasestorage.app",
  messagingSenderId: "428568852806",
  appId: "1:428568852806:web:2d928e5815794002e68d47"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;

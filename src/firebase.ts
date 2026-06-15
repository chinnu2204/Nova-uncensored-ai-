import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB94Hv2-seRZir68SwQGy2Agtd9A4bvlLQ",
  authDomain: "nova-ai-3ff7e.firebaseapp.com",
  databaseURL: "https://nova-ai-3ff7e-default-rtdb.firebaseio.com",
  projectId: "nova-ai-3ff7e",
  storageBucket: "nova-ai-3ff7e.firebasestorage.app",
  messagingSenderId: "1055031447837",
  appId: "1:1055031447837:web:c867bbc3adc63d1363d1f4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

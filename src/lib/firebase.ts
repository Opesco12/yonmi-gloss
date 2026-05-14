import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "REDACTED_FIREBASE_API_KEY",
  authDomain: "REDACTED_FIREBASE_AUTH_DOMAIN",
  projectId: "yonmi-s-gloss",
  storageBucket: "REDACTED_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "REDACTED_FIREBASE_SENDER_ID",
  appId: "1:REDACTED_FIREBASE_SENDER_ID:web:2749f09f7d4af1d234c1ff",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

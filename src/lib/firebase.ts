// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTlqN4cUIIAUTSaluPyEbxKW4guH8w06Y",
  authDomain: "fess-manegment-system.firebaseapp.com",
  projectId: "fess-manegment-system",
  storageBucket: "fess-manegment-system.firebasestorage.app",
  messagingSenderId: "406261430464",
  appId: "1:406261430464:web:ed74d07e95b21f99405525",
  measurementId: "G-ZLH8H4Q6F4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;

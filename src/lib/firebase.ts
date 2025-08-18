// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "tournament-84gy3",
  appId: "1:752054062751:web:acf27a52505a4c9f475caa",
  storageBucket: "tournament-84gy3.firebasestorage.app",
  apiKey: "AIzaSyA8kxPETnf1OJr6rJZRvR-Dh_-IiD6k214",
  authDomain: "tournament-84gy3.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "752054062751",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };

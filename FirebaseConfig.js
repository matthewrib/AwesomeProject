// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPX_exEAc3HqKGCP435t5T9ALYUIYJNv0",
  authDomain: "recollect-1274e.firebaseapp.com",
  projectId: "recollect-1274e",
  storageBucket: "recollect-1274e.appspot.com",
  messagingSenderId: "589377310813",
  appId: "1:589377310813:web:9ba3eb20b9f0f4f51dbdb4",
  measurementId: "G-RBHG7XW4BK"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);

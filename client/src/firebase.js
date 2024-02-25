// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "rentrevolution-8c8f0.firebaseapp.com",
  projectId: "rentrevolution-8c8f0",
  storageBucket: "rentrevolution-8c8f0.appspot.com",
  messagingSenderId: "329135672468",
  appId: "1:329135672468:web:b2e9b7efd92c0e83ae7881"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
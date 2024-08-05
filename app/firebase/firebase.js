import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyATXYgyM7z7vOpgG8z4qlFQ0rz9WjjEt5Q",
  authDomain: "inventory-management-4cc6e.firebaseapp.com",
  projectId: "inventory-management-4cc6e",
  storageBucket: "inventory-management-4cc6e.appspot.com",
  messagingSenderId: "1047113123936",
  appId: "1:1047113123936:web:fddfcd61ddb1f0059b9b05",
  measurementId: "G-HLWDH691KR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

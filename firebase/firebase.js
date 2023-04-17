// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAOw8xQwfqH_4dt7soygrguIx6Ram5BTyo",
  authDomain: "todo-firebase-e48b1.firebaseapp.com",
  projectId: "todo-firebase-e48b1",
  storageBucket: "todo-firebase-e48b1.appspot.com",
  messagingSenderId: "386608940797",
  appId: "1:386608940797:web:a972586f16ce5e09f5e094",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

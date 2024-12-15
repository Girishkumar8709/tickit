import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDuzpwJO82o-f71uik6qjFC5V9q8zELwLs",
  authDomain: "todolist-a4b74.firebaseapp.com",
  projectId: "todolist-a4b74",
  storageBucket: "todolist-a4b74.firebasestorage.app",
  messagingSenderId: "338418837008",
  appId: "1:338418837008:web:a3aa02eee8e38d85c04c95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACx5vnRgSGDOP9tIKcS6wEDEZopcKI2qI",
  authDomain: "bmoo-4c0bc.firebaseapp.com",
  databaseURL: "https://bmoo-4c0bc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bmoo-4c0bc",
  storageBucket: "bmoo-4c0bc.firebasestorage.app",
  messagingSenderId: "833699757985",
  appId: "1:833699757985:web:52af09d449a7ab14b595e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export { database };
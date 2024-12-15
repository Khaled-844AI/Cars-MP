// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "cars-marketplace-63d26.firebaseapp.com",
  projectId: "cars-marketplace-63d26",
  storageBucket: "cars-marketplace-63d26.appspot.com",
  messagingSenderId: "477215246186",
  appId: "1:477215246186:web:6a53dc11107825d6708713",
  measurementId: "G-QSYLBDE4WS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)
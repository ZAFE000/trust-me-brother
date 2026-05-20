import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBuAcd4ofNZPUkdBMa_FrPIjZkPugh9_m0",
  authDomain: "ant-studio---dpu.firebaseapp.com",
  databaseURL: "https://ant-studio---dpu-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ant-studio---dpu",
  storageBucket: "ant-studio---dpu.firebasestorage.app",
  messagingSenderId: "454921524476",
  appId: "1:454921524476:web:0de12f959865c9d6287379",
  measurementId: "G-RZLTRQW37Q"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export { signInWithPopup, signOut, onAuthStateChanged, doc, setDoc, getDoc };
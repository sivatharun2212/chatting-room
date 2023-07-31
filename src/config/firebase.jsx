
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyADznME3ZhWQ_qalAl7JGOVkFrdZH3t_kk",
  authDomain: "chatting-room-56fed.firebaseapp.com",
  projectId: "chatting-room-56fed",
  storageBucket: "chatting-room-56fed.appspot.com",
  messagingSenderId: "279712903699",
  appId: "1:279712903699:web:abe20180da48b2573705e6",
  measurementId: "G-FDDS2Y3FFM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider =new GoogleAuthProvider();
export const db = getFirestore(app)

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBmUf8XJG0eQMNR_CpIeTiU3I3KO8S6vKY",
  authDomain: "chocolicious-auth.firebaseapp.com",
  projectId: "chocolicious-auth",
  storageBucket: "chocolicious-auth.firebasestorage.app",
  messagingSenderId: "847522359758",
  appId: "1:847522359758:web:809cb870cdd3422175639f",
  measurementId: "G-2ZTYXKCYR1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
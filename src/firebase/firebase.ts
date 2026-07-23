import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDy876JtXty19jkIfkyNyo_Rb_rN42lJas",
  authDomain: "coreresearch-33a17.firebaseapp.com",
  projectId: "coreresearch-33a17",
  storageBucket: "coreresearch-33a17.firebasestorage.app",
  messagingSenderId: "372713550211",
  appId: "1:372713550211:web:08eb2c38a10945a226c6b6",
  measurementId: "G-X4NWGLN2F7",
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
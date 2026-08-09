import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebaseConfigJson from "../firebase-applet-config.json";

// User provided config fallback
const userProvidedConfig = {
  apiKey: "AIzaSyDK-4NNgT_qYOg4nvw_jspZu1VyOhhzTKk",
  authDomain: "igneous-fabric-91ttq.firebaseapp.com",
  projectId: "igneous-fabric-91ttq",
  storageBucket: "igneous-fabric-91ttq.firebasestorage.app",
  messagingSenderId: "35134073587",
  appId: "1:35134073587:web:aa2a7ab2f0af6dd4e42586"
};

// Use auto-provisioned config if apiKey exists, else fallback
const activeConfig = (firebaseConfigJson && firebaseConfigJson.apiKey) 
  ? firebaseConfigJson 
  : userProvidedConfig;

const app = !getApps().length ? initializeApp(activeConfig) : getApp();

const dbId = (firebaseConfigJson && (firebaseConfigJson as any).firestoreDatabaseId) 
  ? (firebaseConfigJson as any).firestoreDatabaseId 
  : '(default)';

export const db = (dbId && dbId !== '(default)') ? getFirestore(app, dbId) : getFirestore(app);
export const auth = getAuth(app);
export default app;

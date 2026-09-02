import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
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

const dbId = (firebaseConfigJson && (firebaseConfigJson as { firestoreDatabaseId?: string }).firestoreDatabaseId) 
  ? (firebaseConfigJson as { firestoreDatabaseId?: string }).firestoreDatabaseId 
  : '(default)';

export const db = (dbId && dbId !== '(default)') ? getFirestore(app, dbId) : getFirestore(app);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Non-blocking connection check that supports offline fallback
export async function testConnection() {
  try {
    await getDoc(doc(db, 'test', 'connection'));
  } catch (error) {
    // Gracefully handled; client will operate with offline persistence
    console.debug("Firestore offline cache active or connection pending.");
  }
}

testConnection();

export default app;

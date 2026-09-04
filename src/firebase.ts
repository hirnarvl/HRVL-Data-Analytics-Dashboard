import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebaseConfigJson from "../firebase-applet-config.json";

// User provided config fallback
const userProvidedConfig = {
  apiKey: "AIzaSyBCFJRMbnkv6rB7Z3jBqoNwhXci3Sw0Apo",
  authDomain: "still-loader-mq4x8.firebaseapp.com",
  projectId: "still-loader-mq4x8",
  storageBucket: "still-loader-mq4x8.firebasestorage.app",
  messagingSenderId: "324668104545",
  appId: "1:324668104545:web:e6db48ee856d9f6918ef20"
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

// Gracefully handle connection state testing according to standard guidelines
export async function testFirestoreConnection() {
  try {
    if (typeof document !== 'undefined' && document.hidden) {
      return;
    }
    const { doc, getDocFromServer } = await import('firebase/firestore');
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    if (
      errMsg.includes('offline') || 
      errMsg.includes('auth/network-request-failed') || 
      errMsg.includes('unavailable') ||
      errMsg.includes('closing') ||
      errMsg.includes('hidden') ||
      errMsg.includes('IndexedDB')
    ) {
      // Benign expected offline or backgrounding state in local/preview environments
      console.info('[Firestore] Operating with offline persistence cache.');
    }
  }
}

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
  const errMsg = error instanceof Error ? error.message : String(error);
  
  // Gracefully filter out benign lifecycle and backgrounding transitions
  if (
    errMsg.includes('closing') ||
    errMsg.includes('hidden') ||
    errMsg.includes('offline') ||
    errMsg.includes('aborted') ||
    errMsg.includes('IndexedDB') ||
    errMsg.includes('IDBDatabase')
  ) {
    return null;
  }

  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
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
  console.warn('Firestore notice: ', JSON.stringify(errInfo));
  return errInfo;
}

export default app;

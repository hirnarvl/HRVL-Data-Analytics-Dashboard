import { collection, doc, setDoc, onSnapshot, query, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { SurveillanceRecord } from '../types';
import { saveCachedRecords, loadCachedRecords } from './storage';

const COLLECTION_NAME = 'surveillanceRecords';

/**
 * Listens for real-time surveillance record updates from Firebase Firestore.
 * Automatically falls back to locally cached records when offline or during transient network delays.
 */
export function subscribeToFirestoreRecords(
  onUpdate: (records: SurveillanceRecord[]) => void,
  onError?: (err: unknown) => void
): () => void {
  try {
    const q = query(collection(db, COLLECTION_NAME), limit(1000));
    const unsubscribe = onSnapshot(
      q,
      { includeMetadataChanges: true },
      (snapshot) => {
        if (!snapshot.empty) {
          const recordsFromDb: SurveillanceRecord[] = [];
          snapshot.forEach((docSnap) => {
            recordsFromDb.push({
              ...(docSnap.data() as SurveillanceRecord),
              id: docSnap.id
            });
          });
          // Cache to localStorage for offline resilience
          saveCachedRecords(recordsFromDb);
          onUpdate(recordsFromDb);
        }
      },
      (error) => {
        const errMsg = error instanceof Error ? error.message : String(error);
        // Suppress expected closing/hidden/offline errors when tab unloads, navigates or page visibility changes
        if (
          !errMsg.includes('closing') && 
          !errMsg.includes('hidden') && 
          !errMsg.includes('offline') && 
          !errMsg.includes('aborted')
        ) {
          handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
        }
        // Fall back gracefully to cached records on unavailable / offline / backgrounding
        const cached = loadCachedRecords();
        if (cached && cached.length > 0) {
          onUpdate(cached);
        }
        if (onError) onError(error);
      }
    );
    return unsubscribe;
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    if (!errMsg.includes('closing') && !errMsg.includes('hidden')) {
      handleFirestoreError(err, OperationType.LIST, COLLECTION_NAME);
    }
    const cached = loadCachedRecords();
    if (cached && cached.length > 0) {
      onUpdate(cached);
    }
    return () => {};
  }
}

/**
 * Saves or updates a single surveillance record in Firebase Firestore.
 */
export async function saveRecordToFirestore(record: SurveillanceRecord): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTION_NAME, record.id);
    await setDoc(docRef, record, { merge: true });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${COLLECTION_NAME}/${record.id}`);
    return false;
  }
}

/**
 * Seeds initial surveillance records to Firestore if collection is empty.
 */
export async function seedRecordsToFirestore(records: SurveillanceRecord[]): Promise<void> {
  try {
    for (const record of records.slice(0, 50)) { // seed representative subset for performance
      const docRef = doc(db, COLLECTION_NAME, record.id);
      await setDoc(docRef, record, { merge: true });
    }
    console.log('[Firebase] Successfully seeded records to Firestore');
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, COLLECTION_NAME);
  }
}

import { collection, doc, setDoc, onSnapshot, query, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { SurveillanceRecord } from '../types';
import { saveCachedRecords } from './storage';

const COLLECTION_NAME = 'surveillanceRecords';

/**
 * Listens for real-time surveillance record updates from Firebase Firestore.
 */
export function subscribeToFirestoreRecords(
  onUpdate: (records: SurveillanceRecord[]) => void,
  onError?: (err: any) => void
): () => void {
  try {
    const q = query(collection(db, COLLECTION_NAME), limit(1000));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const recordsFromDb: SurveillanceRecord[] = [];
          snapshot.forEach((docSnap) => {
            recordsFromDb.push({
              ...(docSnap.data() as SurveillanceRecord),
              id: docSnap.id
            });
          });
          // Cache to localStorage for offline access
          saveCachedRecords(recordsFromDb);
          onUpdate(recordsFromDb);
        }
      },
      (error) => {
        console.warn('[Firebase] Firestore listener notice:', error);
        if (onError) onError(error);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('[Firebase] Could not subscribe to Firestore:', err);
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
    console.warn('[Firebase] Failed to save record to Firestore (will remain cached locally):', err);
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
    console.warn('[Firebase] Could not seed records to Firestore:', err);
  }
}

import { SurveillanceRecord } from '../types';
import { INITIAL_SURVEILLANCE_RECORDS } from '../data/sampleData';

const LOCAL_STORAGE_KEY = 'hrvl_surveillance_records_v1';
const LOCAL_STORAGE_TIMESTAMP_KEY = 'hrvl_surveillance_last_saved';

/**
 * Loads cached surveillance records from browser localStorage.
 * Falls back to INITIAL_SURVEILLANCE_RECORDS if no cache exists or if parsing fails.
 */
export function loadCachedRecords(): SurveillanceRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[HRVL Storage] Failed to read surveillance records from localStorage:', err);
  }
  return INITIAL_SURVEILLANCE_RECORDS;
}

/**
 * Saves current surveillance records to browser localStorage for offline field resilience.
 */
export function saveCachedRecords(records: SurveillanceRecord[]): boolean {
  try {
    const serialized = JSON.stringify(records);
    localStorage.setItem(LOCAL_STORAGE_KEY, serialized);
    const nowIso = new Date().toISOString();
    localStorage.setItem(LOCAL_STORAGE_TIMESTAMP_KEY, nowIso);
    return true;
  } catch (err) {
    console.error('[HRVL Storage] Failed to cache records in localStorage:', err);
    return false;
  }
}

/**
 * Clears cached surveillance records from localStorage and resets back to initial default.
 */
export function clearCachedRecords(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_TIMESTAMP_KEY);
  } catch (err) {
    console.error('[HRVL Storage] Failed to clear localStorage cache:', err);
  }
}

/**
 * Returns diagnostic metadata regarding local storage cache state.
 */
export function getStorageMetadata(): {
  hasCache: boolean;
  recordCount: number;
  lastSavedTimestamp: string | null;
  approxSizeKB: number;
} {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const timestamp = localStorage.getItem(LOCAL_STORAGE_TIMESTAMP_KEY);
    if (!raw) {
      return {
        hasCache: false,
        recordCount: 0,
        lastSavedTimestamp: null,
        approxSizeKB: 0
      };
    }
    const sizeInKB = Math.round((raw.length * 2) / 1024); // approx UTF-16 bytes
    const parsed = JSON.parse(raw);
    return {
      hasCache: true,
      recordCount: Array.isArray(parsed) ? parsed.length : 0,
      lastSavedTimestamp: timestamp,
      approxSizeKB: sizeInKB
    };
  } catch (err) {
    return {
      hasCache: false,
      recordCount: 0,
      lastSavedTimestamp: null,
      approxSizeKB: 0
    };
  }
}

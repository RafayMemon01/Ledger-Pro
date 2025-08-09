import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Path: /users/{uid}/ledgers
 * Ledger shape:
 * { name: string, type: 'personal'|'business', createdAt: Timestamp, updatedAt: Timestamp }
 */

export const ledgersCollection = (uid) => collection(db, 'users', uid, 'ledgers');

export async function createLedger(uid, payload) {
  const newLedger = {
    name: payload.name,
    type: payload.type,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(ledgersCollection(uid), newLedger);
  return { id: ref.id, ...newLedger };
}

export async function updateLedger(uid, ledgerId, updates) {
  const docRef = doc(db, 'users', uid, 'ledgers', ledgerId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
  return true;
}

export async function deleteLedger(uid, ledgerId) {
  const docRef = doc(db, 'users', uid, 'ledgers', ledgerId);
  // NOTE: this deletes only the ledger doc. If transactions exist in
  // /users/{uid}/ledgers/{ledgerId}/transactions they must be deleted separately.
  await deleteDoc(docRef);
  return true;
}

// Real-time subscription to all ledgers for a user, ordered by createdAt desc
export function subscribeToLedgers(uid, onUpdate) {
  const q = query(ledgersCollection(uid), orderBy('createdAt', 'desc'));
  const unsub = onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    onUpdate(items);
  });
  return unsub; // call to stop listening
}

// Utility: Fetch once (for pagination or initial load)
export async function fetchLedgersOnce(uid) {
  const q = query(ledgersCollection(uid), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

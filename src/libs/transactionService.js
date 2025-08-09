// src/libs/transactionService.js

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
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Helper: Returns Firestore collection reference for a user's ledger transactions
 */
export const transactionsCollection = (uid, ledgerId) =>
  collection(db, "users", uid, "ledgers", ledgerId, "transactions");

/**
 * Create a new transaction (credit or debit)
 */
export async function createTransaction(uid, ledgerId, payload) {
  const txn = {
    amount: Number(payload.amount),
    type: payload.type, // 'credit' or 'debit'
    note: payload.note || "",
    date: payload.date || serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(transactionsCollection(uid, ledgerId), txn);
  return { id: ref.id, ...txn };
}

/**
 * Update an existing transaction
 */
export async function updateTransaction(uid, ledgerId, txnId, updates) {
  const docRef = doc(
    db,
    "users",
    uid,
    "ledgers",
    ledgerId,
    "transactions",
    txnId
  );
  await updateDoc(docRef, {
    ...updates,
    amount: Number(updates.amount),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a transaction
 */
export async function deleteTransaction(uid, ledgerId, txnId) {
  const docRef = doc(
    db,
    "users",
    uid,
    "ledgers",
    ledgerId,
    "transactions",
    txnId
  );
  await deleteDoc(docRef);
}

/**
 * Live subscription to transactions (ordered by date)
 */
export function subscribeToTransactions(uid, ledgerId, onUpdate) {
  const q = query(
    transactionsCollection(uid, ledgerId),
    orderBy("date", "desc")
  );
  const unsub = onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    onUpdate(items);
  });
  return unsub;
}

/**
 * Fetch transactions one-time (ordered by date)
 */
export async function fetchTransactionsOnce(uid, ledgerId) {
  const q = query(
    transactionsCollection(uid, ledgerId),
    orderBy("date", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Alias for fetchTransactionsOnce, used for balance calculations
 */
export async function getTransactions(uid, ledgerId) {
  return await fetchTransactionsOnce(uid, ledgerId);
}

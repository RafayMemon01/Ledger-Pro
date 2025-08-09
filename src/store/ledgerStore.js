// src/store/ledgerStore.js
import { create } from 'zustand';
import { subscribeToLedgers } from '../libs/ledgerService';
import { useAuthStore } from './authStore';

export const useLedgerStore = create((set, get) => ({
  ledgers: [],
  loading: false,
  error: null,
  unsub: null,

  startListening: (uid) => {
    if (!uid) return;
    set({ loading: true });
    // if already listening — unsubscribe first
    const currentUnsub = get().unsub;
    if (currentUnsub) currentUnsub();

    const unsub = subscribeToLedgers(uid, (items) => {
      set({ ledgers: items, loading: false });
    });

    set({ unsub });
  },

  stopListening: () => {
    const currentUnsub = get().unsub;
    if (currentUnsub) {
      currentUnsub();
      set({ unsub: null, ledgers: [] });
    }
  },
}));

// Hook: automatically start/stop listener based on auth user
export function useAutoLedgerListener() {
  const user = useAuthStore((s) => s.user);
  const startListening = useLedgerStore((s) => s.startListening);
  const stopListening = useLedgerStore((s) => s.stopListening);

  // Use React effect inside components to call this helper.
  return { user, startListening, stopListening };
}

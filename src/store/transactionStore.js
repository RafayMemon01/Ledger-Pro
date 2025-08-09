import { create } from 'zustand';
import { subscribeToTransactions } from '../libs/transactionService';

export const useTransactionStore = create((set, get) => ({
  transactions: [],
  loading: false,
  unsub: null,

  startListening: (uid, ledgerId) => {
    if (!uid || !ledgerId) return;
    set({ loading: true });
    const currentUnsub = get().unsub;
    if (currentUnsub) currentUnsub();

    const unsub = subscribeToTransactions(uid, ledgerId, (items) => {
      set({ transactions: items, loading: false });
    });

    set({ unsub });
  },

  stopListening: () => {
    const currentUnsub = get().unsub;
    if (currentUnsub) currentUnsub();
    set({ transactions: [], unsub: null });
  },
}));

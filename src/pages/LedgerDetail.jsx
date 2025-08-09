import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTransactionStore } from '../store/transactionStore';
import { useAuthStore } from '../store/authStore';
import TransactionForm from '../components/TransactionForm';
import { deleteTransaction } from '../libs/transactionService';
    
export default function LedgerDetail() {
  const { ledgerId } = useParams();
  const { user } = useAuthStore();
  const transactions = useTransactionStore((s) => s.transactions);
  const loading = useTransactionStore((s) => s.loading);
  const startListening = useTransactionStore((s) => s.startListening);
  const stopListening = useTransactionStore((s) => s.stopListening);

  const [showForm, setShowForm] = useState(false);
  const [editTxn, setEditTxn] = useState(null);

  useEffect(() => {
    if (user && ledgerId) startListening(user.uid, ledgerId);
    return () => stopListening();
  }, [user, ledgerId, startListening, stopListening]);

  const runningBalance = transactions.reduce((sum, txn) => {
    return txn.type === 'credit' ? sum + txn.amount : sum - txn.amount;
  }, 0);

  const onDelete = async (txn) => {
    if (!user) return;
    if (!confirm('Delete this transaction?')) return;
    try {
      await deleteTransaction(user.uid, ledgerId, txn.id);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="p-4">
      <Link to="/dashboard" className="text-blue-600">&larr; Back</Link>
      <h2 className="text-2xl font-bold mt-2">Ledger Transactions</h2>
      <p className="text-lg font-semibold">Balance: {runningBalance.toFixed(2)}</p>

      <button onClick={() => { setShowForm(true); setEditTxn(null); }} className="bg-green-600 text-white px-3 py-1 mt-3 rounded">
        + Add Transaction
      </button>

      {showForm && (
        <div className="my-4 p-4 border rounded bg-white">
          <TransactionForm
            ledgerId={ledgerId}
            mode={editTxn ? 'edit' : 'create'}
            defaultValues={editTxn || {}}
            onSuccess={() => { setShowForm(false); setEditTxn(null); }}
            onCancel={() => { setShowForm(false); setEditTxn(null); }}
          />
        </div>
      )}

      <div className="mt-4 space-y-2">
        {loading && <p>Loading...</p>}
        {!loading && transactions.length === 0 && <p>No transactions yet.</p>}
        {transactions.map((txn) => (
          <div key={txn.id} className="p-3 bg-white border rounded flex justify-between items-center">
            <div>
              <div className="font-medium">{txn.amount} ({txn.type})</div>
              {txn.note && <div className="text-sm text-gray-500">{txn.note}</div>}
              <div className="text-xs text-gray-400">
                {txn.date?.seconds ? new Date(txn.date.seconds * 1000).toLocaleDateString() : ''}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditTxn(txn); setShowForm(true); }} className="px-2 py-1 border rounded">Edit</button>
              <button onClick={() => onDelete(txn)} className="px-2 py-1 border rounded text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

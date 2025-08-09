// src/pages/DashboardLedgers.jsx
import { useEffect, useState } from "react";
import { useLedgerStore, useAutoLedgerListener } from "../store/ledgerStore";
import { useAuthStore } from "../store/authStore";
import LedgerForm from "../components/LedgerForm";
import { deleteLedger } from "../libs/ledgerService";
import { getTransactions } from "../libs/transactionService";

import { Link } from "react-router-dom";

export default function DashboardLedgers() {
  const { user } = useAuthStore();
  const ledgers = useLedgerStore((s) => s.ledgers);
  const loading = useLedgerStore((s) => s.loading);
  const { startListening, stopListening } = useAutoLedgerListener();

  const [showForm, setShowForm] = useState(false);
  const [editLedger, setEditLedger] = useState(null);
  const [ledgerStats, setLedgerStats] = useState({}); // { ledgerId: { credit, debit, balance } }

  // Listen to ledgers
  useEffect(() => {
    if (user) startListening(user.uid);
    else stopListening();
    return () => stopListening();
  }, [user]);

  // Fetch balances for each ledger
  useEffect(() => {
    if (!user || ledgers.length === 0) return;

    async function fetchStats() {
      const stats = {};
      for (const ledger of ledgers) {
        const txns = await getTransactions(user.uid, ledger.id);
        const credit = txns
          .filter(t => t.type === "credit")
          .reduce((sum, t) => sum + Number(t.amount), 0);
        const debit = txns
          .filter(t => t.type === "debit")
          .reduce((sum, t) => sum + Number(t.amount), 0);
        stats[ledger.id] = {
          credit,
          debit,
          balance: credit - debit
        };
      }
      setLedgerStats(stats);
    }

    fetchStats();
  }, [user, ledgers]);

  const onCreateClick = () => {
    setEditLedger(null);
    setShowForm(true);
  };

  const onEdit = (ledger) => {
    setEditLedger(ledger);
    setShowForm(true);
  };

  const onDelete = async (ledger) => {
    if (!user) return;
    if (!confirm(`Delete ledger "${ledger.name}"?`)) return;

    try {
      await deleteLedger(user.uid, ledger.id);
      alert("Ledger deleted successfully");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete ledger");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">My Ledgers</h3>
        <button
          onClick={onCreateClick}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          + New Ledger
        </button>
      </div>

      {/* Ledger Form */}
      {showForm && (
        <div className="mb-4 p-4 border rounded bg-white">
          <LedgerForm
            mode={editLedger ? "edit" : "create"}
            defaultValues={editLedger || {}}
            onSuccess={() => {
              setShowForm(false);
              setEditLedger(null);
            }}
            onCancel={() => {
              setShowForm(false);
              setEditLedger(null);
            }}
          />
        </div>
      )}

      {/* Ledger List */}
      <div className="space-y-2">
        {loading && <p>Loading...</p>}
        {!loading && ledgers.length === 0 && <p>No ledgers yet — create one.</p>}

        {ledgers.map((ledger) => {
          const stats = ledgerStats[ledger.id] || { credit: 0, debit: 0, balance: 0 };
          return (
            <div
              key={ledger.id}
              className="p-3 bg-white border rounded flex justify-between items-center"
            >
              <div>
                <div className="font-medium">{ledger.name}</div>
                <div className="text-sm text-gray-500">{ledger.type}</div>
                <div className="mt-1 text-sm">
                  <span className="text-green-600">Credit: {stats.credit.toFixed(2)}</span>{" | "}
                  <span className="text-red-600">Debit: {stats.debit.toFixed(2)}</span>{" | "}
                  <span className="font-semibold">Balance: {stats.balance.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(ledger)}
                  className="px-2 py-1 border rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(ledger)}
                  className="px-2 py-1 border rounded text-red-600"
                >
                  Delete
                </button>
                <Link
                  to={`/ledger/${ledger.id}`}
                  className="px-2 py-1 border rounded bg-blue-500 text-white"
                >
                  Open
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

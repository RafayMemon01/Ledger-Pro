// src/components/TransactionList.jsx
import { useEffect, useState } from "react";
import { db } from "../libs/firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { useAuthStore } from "../store/authStore";

export default function TransactionList({ ledgerId }) {
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!user || !ledgerId) return;

    const q = query(
      collection(db, "users", user.uid, "ledgers", ledgerId, "transactions"),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(data);
    });

    return () => unsubscribe();
  }, [user, ledgerId]);

  if (transactions.length === 0) {
    return <p className="text-gray-500 text-center py-4">No transactions yet.</p>;
  }

  return (
    <div className="space-y-3">
      {transactions.map((txn) => (
        <div
          key={txn.id}
          className={`flex justify-between items-center p-3 rounded shadow ${
            txn.type === "credit" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <div>
            <p className="font-medium">{txn.note}</p>
            <p className="text-sm text-gray-500">{new Date(txn.date).toLocaleDateString()}</p>
          </div>
          <div className="font-bold">
            {txn.type === "credit" ? "+" : "-"} {txn.amount}
          </div>
        </div>
      ))}
    </div>
  );
}

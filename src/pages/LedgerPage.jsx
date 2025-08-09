import { useParams } from "react-router-dom";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";

export default function LedgerPage() {
  const { ledgerId } = useParams();

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ledger Details</h1>
      <TransactionForm ledgerId={ledgerId} />
      <TransactionList ledgerId={ledgerId} />
    </div>
  );
}

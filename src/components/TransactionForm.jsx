import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createTransaction, updateTransaction } from "../libs/transactionService";
import { useAuthStore } from "../store/authStore";

// ✅ Validation schema
const schema = yup.object({
  amount: yup.number().positive().required("Amount is required"),
  type: yup.string().oneOf(["credit", "debit"]).required(),
  note: yup.string().max(200),
  date: yup.date().required(),
});

export default function TransactionForm({
  ledgerId,
  mode = "create",
  defaultValues = {},
  onSuccess,
  onCancel,
}) {
  const user = useAuthStore((s) => s.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      amount: "",
      type: "credit",
      note: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  // ✅ Reset form only when defaultValues change
  useEffect(() => {
    if (Object.keys(defaultValues).length > 0) {
      reset({
        amount: defaultValues.amount || "",
        type: defaultValues.type || "credit",
        note: defaultValues.note || "",
        date: defaultValues.date
          ? new Date(defaultValues.date.seconds * 1000).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    }
  }, [defaultValues, reset]);

  const onSubmit = async (data) => {
    if (!user) return;
    try {
      const payload = {
        ...data,
        date: new Date(data.date),
      };

      if (mode === "create") {
        await createTransaction(user.uid, ledgerId, payload);
      } else {
        await updateTransaction(user.uid, ledgerId, defaultValues.id, payload);
      }

      onSuccess?.();
      reset(); // Clear form after success
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save transaction");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {/* Amount */}
      <div>
        <label>Amount</label>
        <input
          type="number"
          step="0.01"
          {...register("amount")}
          className="border p-2 w-full"
        />
        {errors.amount && <p className="text-red-500">{errors.amount.message}</p>}
      </div>

      {/* Type */}
      <div>
        <label>Type</label>
        <select {...register("type")} className="border p-2 w-full">
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
        {errors.type && <p className="text-red-500">{errors.type.message}</p>}
      </div>

      {/* Note */}
      <div>
        <label>Note</label>
        <input {...register("note")} className="border p-2 w-full" />
        {errors.note && <p className="text-red-500">{errors.note.message}</p>}
      </div>

      {/* Date */}
      <div>
        <label>Date</label>
        <input type="date" {...register("date")} className="border p-2 w-full" />
        {errors.date && <p className="text-red-500">{errors.date.message}</p>}
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          disabled={isSubmitting}
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {mode === "create" ? "Add Transaction" : "Save Changes"}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">
          Cancel
        </button>
      </div>
    </form>
  );
}

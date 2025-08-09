// src/components/LedgerForm.jsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createLedger, updateLedger } from '../libs/ledgerService';
import { useAuthStore } from '../store/authStore';

const schema = yup.object().shape({
  name: yup.string().trim().min(2).max(100).required('Name is required'),
  type: yup.string().oneOf(['personal', 'business']).required(),
});

export default function LedgerForm({ mode = 'create', defaultValues = {}, onSuccess, onCancel }) {
  const user = useAuthStore((s) => s.user);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', type: 'personal', ...defaultValues },
  });

  useEffect(() => {
    reset({ name: defaultValues.name || '', type: defaultValues.type || 'personal' });
  }, [defaultValues, reset]);

  const onSubmit = async (data) => {
    if (!user) return;
    try {
      if (mode === 'create') {
        await createLedger(user.uid, data);
      } else {
        await updateLedger(user.uid, defaultValues.id, data);
      }
      onSuccess && onSuccess();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          {...register('name')}
          className="mt-1 block w-full border rounded p-2"
          placeholder="e.g., Personal Wallet"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Type</label>
        <select {...register('type')} className="mt-1 block w-full border rounded p-2">
          <option value="personal">Personal</option>
          <option value="business">Business</option>
        </select>
        {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded">
          {mode === 'create' ? 'Create Ledger' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">
          Cancel
        </button>
      </div>
    </form>
  );
}

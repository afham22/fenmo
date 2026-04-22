// app/page.tsx
'use client';
import { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { PlusCircle, Filter, ArrowUpDown, Loader2, AlertCircle } from 'lucide-react';

export default function ExpenseTracker() {
  const { expenses, loading, error, setFilter, setSort, total, refresh } = useExpenses();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Form State
  const [form, setForm] = useState({
    amount: '', category: 'Food', description: '', date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; 

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          amount: parseFloat(form.amount),
          idempotencyKey: crypto.randomUUID(),
        }),
      });

      if (!response.ok) throw new Error('Submission failed');
      
      setForm({ ...form, amount: '', description: '' }); 
      refresh(); 
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <PlusCircle className="text-blue-600" /> New Expense
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Amount</label>
              <input 
                type="number" step="0.01" required
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.amount} onChange={e => setForm({...form, amount: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Category</label>
              <select 
                className="w-full mt-1 p-2 border rounded-lg bg-white"
                value={form.category} onChange={e => setForm({...form, category: e.target.value})}
              >
                <option value="Food">Food & Dining</option>
                <option value="Transportation">Transportation</option>
                <option value="Shopping">Shopping</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Bills & Utilities">Bills & Utilities</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Travel">Travel</option>
                <option value="Groceries">Groceries</option>
                <option value="Rent">Rent</option>
                <option value="Tech">Tech & Gadgets</option>
                <option value="Leisure">Leisure</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Date</label>
              <input 
                type="date" required
                className="w-full mt-1 p-2 border rounded-lg"
                value={form.date} onChange={e => setForm({...form, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Description</label>
              <textarea 
                className="w-full mt-1 p-2 border rounded-lg"
                value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              />
            </div>
            
            {submitError && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle size={16} /> {submitError}
              </div>
            )}

            <button 
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 flex justify-center items-center"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Add Expense'}
            </button>
          </form>
        </section>

        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Filter size={18} />
                <select onChange={e => setFilter(e.target.value)} className="border-none bg-transparent font-medium focus:ring-0">
                  <option value="">All Categories</option>
                  <option value="Food">Food & Dining</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Bills & Utilities">Bills & Utilities</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Travel">Travel</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Rent">Rent</option>
                  <option value="Tech">Tech & Gadgets</option>
                  <option value="Leisure">Leisure</option>
                  <option value="Other">Other</option>
                </select>
              </div>₹
              <div className="flex items-center gap-2 text-slate-500 border-l pl-4">
                <ArrowUpDown size={18} />
                <select onChange={e => setSort(e.target.value)} className="border-none bg-transparent font-medium focus:ring-0">
                  <option value="date_desc">Newest First</option>
                  <option value="date_asc">Oldest First</option>
                </select>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 font-medium">Total Expense</p>
              <p className="text-2xl font-bold text-blue-600">₹{total.toFixed(2)}</p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="animate-spin mb-2" />
                <p>Loading expenses...</p>
              </div>
            ) : error ? (
              <div className="p-12 text-center text-red-500">
                <p>Error: {error}</p>
                <button onClick={refresh} className="mt-4 text-blue-600 underline">Try Again</button>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-4 font-semibold text-slate-600">Date</th>
                    <th className="p-4 font-semibold text-slate-600">Category</th>
                    <th className="p-4 font-semibold text-slate-600">Description</th>
                    <th className="p-4 font-semibold text-slate-600 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {expenses.map((exp: any) => (
                    <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-slate-600">{new Date(exp.date).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {exp.category}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 italic text-sm">{exp.description || '-'}</td>
                      <td className="p-4 text-right font-bold text-slate-800">₹{parseFloat(exp.amount).toFixed(2)}</td>
                    </tr>
                  ))}
                  {expenses.length === 0 && (
                    <tr><td colSpan={4} className="p-12 text-center text-slate-400">No expenses found.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
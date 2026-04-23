// app/page.tsx
'use client';
import { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { getCategoryColor } from '../utils/categoryColors';
import { PlusCircle, Filter, ArrowUpDown, Loader2, AlertCircle, Calendar } from 'lucide-react';

export default function ExpenseTracker() {
  const { expenses, loading, error, setFilter, setSort, setMonth, setYear, month, year, total, refresh } = useExpenses();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Form State
  const [form, setForm] = useState({
    amount: '', category: 'Food', description: '', date: new Date().toISOString().split('T')[0]
  });

  // Validation logic
  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Validate amount
    if (!form.amount) {
      errors.amount = 'Amount is required';
    } else {
      const amount = parseFloat(form.amount);
      if (isNaN(amount) || amount <= 0) {
        errors.amount = 'Amount must be greater than 0';
      } else if (amount < 0) {
        errors.amount = 'Amount cannot be negative';
      } else {
        // Check for max 2 decimal places
        const decimalPlaces = (form.amount.split('.')[1] || '').length;
        if (decimalPlaces > 2) {
          errors.amount = 'Amount can have at most 2 decimal places';
        }
      }
    }

    // Validate description
    if (form.description && form.description.length > 256) {
      errors.description = `Description cannot exceed 256 characters (currently ${form.description.length})`;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm({ ...form, amount: value });
    // Clear error when user starts typing
    if (validationErrors.amount) {
      setValidationErrors({ ...validationErrors, amount: '' });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 256) {
      setForm({ ...form, description: value });
      if (validationErrors.description) {
        setValidationErrors({ ...validationErrors, description: '' });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Submission failed');
      }
      
      setForm({ ...form, amount: '', description: '' }); 
      setValidationErrors({});
      refresh(); 
    } catch (err) {
      setSubmitError('An unexpected error occurred. Please try again.');
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
                className={`w-full mt-1 p-2 border rounded-lg focus:ring-2 outline-none ${
                  validationErrors.amount ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'
                }`}
                value={form.amount} 
                onChange={handleAmountChange}
                placeholder="0.00"
              />
              {validationErrors.amount && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {validationErrors.amount}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Category</label>
              <select 
                className="w-full mt-1 p-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
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
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.date} onChange={e => setForm({...form, date: e.target.value})}
              />
            </div>
            <div>
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-slate-700">Description (Optional)</label>
                <span className={`text-xs ${form.description.length > 240 ? 'text-orange-500' : 'text-slate-400'}`}>
                  {form.description.length}/256
                </span>
              </div>
              <textarea 
                className={`w-full mt-1 p-2 border rounded-lg focus:ring-2 outline-none resize-none ${
                  validationErrors.description ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'
                }`}
                value={form.description} 
                onChange={handleDescriptionChange}
                placeholder="Add a note about this expense..."
                rows={3}
              />
              {validationErrors.description && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {validationErrors.description}
                </p>
              )}
            </div>
            
            {submitError && (
              <div className="text-red-500 text-sm flex items-center gap-1 bg-red-50 p-2 rounded">
                <AlertCircle size={16} /> {submitError}
              </div>
            )}

            <button 
              disabled={isSubmitting || Object.keys(validationErrors).some(key => validationErrors[key])}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Add Expense'}
            </button>
          </form>
        </section>

        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-2 items-center flex-wrap">
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
                  </div>
                  
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
              
              <div className="flex gap-4 items-end flex-wrap border-t pt-4">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-slate-500" />
                  <div>
                    <label className="block text-xs font-medium text-slate-600">Month</label>
                    <select 
                      value={month} 
                      onChange={e => setMonth(e.target.value)} 
                      className="px-3 py-2 border border-slate-200 rounded-lg bg-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">All Months</option>
                      <option value="01">January</option>
                      <option value="02">February</option>
                      <option value="03">March</option>
                      <option value="04">April</option>
                      <option value="05">May</option>
                      <option value="06">June</option>
                      <option value="07">July</option>
                      <option value="08">August</option>
                      <option value="09">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-600">Year</label>
                  <select 
                    value={year} 
                    onChange={e => setYear(e.target.value)} 
                    className="px-3 py-2 border border-slate-200 rounded-lg bg-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">All Years</option>
                    {Array.from({ length: 5 }, (_, i) => {
                      const yr = new Date().getFullYear() - i;
                      return <option key={yr} value={yr.toString()}>{yr}</option>;
                    })}
                  </select>
                </div>
              </div>
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
                  {expenses.map((exp: any) => {
                    const colors = getCategoryColor(exp.category);
                    return (
                      <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 text-slate-600">{new Date(exp.date).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}>
                            {exp.category}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 italic text-sm">{exp.description || '-'}</td>
                        <td className="p-4 text-right font-bold text-slate-800">₹{parseFloat(exp.amount).toFixed(2)}</td>
                      </tr>
                    );
                  })}
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

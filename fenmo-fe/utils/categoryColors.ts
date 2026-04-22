export const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  'Food': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  'Transportation': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Shopping': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  'Entertainment': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Bills & Utilities': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  'Healthcare': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  'Education': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  'Travel': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  'Groceries': { bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200' },
  'Rent': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Tech': { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
  'Leisure': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  'Other': { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
};

export const getCategoryColor = (category: string) => {
  return categoryColors[category] || categoryColors['Other'];
};

// hooks/useExpenses.ts
import { useState, useEffect, useMemo } from 'react';

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('date_desc');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
      const params = new URLSearchParams();
      if (filter) params.append('category', filter);
      params.append('sort', sort);
      if (month) params.append('month', month);
      if (year) params.append('year', year);
      
      const res = await fetch(`${apiUrl}/expenses?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExpenses(); }, [filter, sort, month, year]);

  const total = useMemo(() => {
    return expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  }, [expenses]);

  return { 
    expenses, 
    loading, 
    error, 
    setFilter, 
    setSort, 
    setMonth, 
    setYear, 
    month, 
    year, 
    total, 
    refresh: fetchExpenses 
  };
}
'use client';
import { useState } from 'react';

export default function Sandbox() {
  const [valuation, setValuation] = useState(1_000_000);
  const [sigma] = useState(0.4);
  const [action, setAction] = useState<'burn_down'|'burn_up'|'do_nothing'|'exit'>('burn_down');
  const [mentor, setMentor] = useState('');
  const [loading, setLoading] = useState(false);

  const nextTick = async () => {
    setLoading(true);
    const res = await fetch('/api/tick', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valuation, sigma, action }),
    });
    const data = await res.json();
    setValuation(data.new_valuation);
    setMentor(data.mentor);
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Valuation: ${valuation.toFixed(0)}</h1>
      <select
        className="border p-1"
        value={action}
        onChange={e => setAction(e.target.value as any)}
      >
        <option value="burn_down">Cut burn</option>
        <option value="burn_up">Increase burn</option>
        <option value="do_nothing">Do nothing</option>
        <option value="exit">Exit now</option>
      </select>
      <button
        onClick={nextTick}
        disabled={loading}
        className="ml-2 px-3 py-1 border rounded"
      >
        {loading ? '...' : 'Next Tick'}
      </button>
      {mentor && (
        <div className="mt-4 p-3 border rounded bg-gray-50">
          <strong>MentorBot:</strong> {mentor}
        </div>
      )}
    </div>
  );
}

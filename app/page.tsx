'use client';

import { useState } from 'react';

export default function Page() {
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
    <main style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Valuation: ${valuation.toFixed(0)}</h1>
      <select value={action} onChange={e => setAction(e.target.value as any)}>
        <option value="burn_down">Cut burn</option>
        <option value="burn_up">Increase burn</option>
        <option value="do_nothing">Do nothing</option>
        <option value="exit">Exit now</option>
      </select>
      <button onClick={nextTick} disabled={loading} style={{ marginLeft: 8 }}>
        {loading ? '…' : 'Next Tick'}
      </button>
      {mentor && (
        <section style={{ marginTop: 20, padding: 10, background: '#f5f5f5' }}>
          <strong>MentorBot:</strong> {mentor}
        </section>
      )}
    </main>
  );
}

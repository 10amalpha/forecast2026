'use client'
import React, { useState } from 'react'

export default function HorseRace() {
  const [assets, setAssets] = useState([
    { ticker: 'PLTR', name: 'Palantir', start: 178, current: 178, target: 300, color: '#8B5CF6' },
    { ticker: 'HOOD', name: 'Robinhood', start: 120, current: 120, target: 240, color: '#22C55E' },
    { ticker: 'TSLA', name: 'Tesla', start: 441, current: 441, target: 850, color: '#EF4444' },
    { ticker: 'STKE', name: 'Sol Strategies', start: 2.4, current: 2.4, target: 10, color: '#3B82F6' },
    { ticker: 'QSI', name: 'Quantum-Si', start: 1.27, current: 1.27, target: 7.5, color: '#EC4899' },
    { ticker: 'HIMS', name: 'Hims & Hers', start: 32, current: 32, target: 75, color: '#14B8A6' },
    { ticker: 'BTC', name: 'Bitcoin', start: 95000, current: 95000, target: 250000, color: '#F59E0B' },
    { ticker: 'SOL', name: 'Solana', start: 145, current: 145, target: 450, color: '#9333EA' },
    { ticker: 'JUP', name: 'Jupiter', start: 0.23, current: 0.23, target: 5, color: '#6366F1' },
    { ticker: 'NOS', name: 'Nosana', start: 0.36, current: 0.36, target: 4, color: '#84CC16' },
    { ticker: 'SHDW', name: 'Shadow', start: 0.51, current: 0.51, target: 1.5, color: '#6B7280' }
  ])
  const [editing, setEditing] = useState(null)
  const [newPrice, setNewPrice] = useState('')
  const updatePrice = (ticker: string) => { const price = parseFloat(newPrice); if (!isNaN(price) && price > 0) setAssets(assets.map(a => a.ticker === ticker ? { ...a, current: price } : a)); setEditing(null); setNewPrice('') }
  const getProgress = (a) => Math.min(Math.max(((a.current - a.start) / (a.target - a.start)) * 100, 0), 100)
  const getChange = (a) => ((a.current - a.start) / a.start) * 100
  const sorted = [...assets].sort((a, b) => getProgress(b) - getProgress(a))
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: 'white', fontSize: '48px', fontWeight: 'bold', marginBottom: '10px' }}>Carrera a la Meta 2026</h1>
          <p style={{ color: '#94a3b8', fontSize: '18px' }}>Portfolio Tracker 14 Enero - 31 Diciembre 2026</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', maxWidth: '800px', margin: '0 auto 40px auto' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.1))', border: '2px solid rgba(139, 92, 246, 0.3)', borderRadius: '20px', padding: '24px' }}>
            <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>Top 3 Progreso a Meta</h3>
            {sorted.slice(0, 3).map((a, i) => <div key={a.ticker} style={{ marginBottom: '12px' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'white', fontWeight: 'bold' }}>{['🥇','🥈','🥉'][i]} {a.ticker}</span><span style={{ color: a.color, fontWeight: 'bold' }}>{getProgress(a).toFixed(1)}%</span></div></div>)}
          </div>
          <div style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.1))', border: '2px solid rgba(34, 197, 94, 0.3)', borderRadius: '20px', padding: '24px' }}>
            <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>Top 3 Velocidad (ROI)</h3>
            {[...assets].sort((a, b) => getChange(b) - getChange(a)).slice(0, 3).map((a, i) => <div key={a.ticker} style={{ marginBottom: '12px' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'white', fontWeight: 'bold' }}>{['🚀','⚡','💨'][i]} {a.ticker}</span><span style={{ color: getChange(a) >= 0 ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>{getChange(a) > 0 ? '+' : ''}{getChange(a).toFixed(1)}%</span></div></div>)}
          </div>
        </div>
        <div style={{ background: 'rgba(30, 41, 59, 0.6)', borderRadius: '20px', padding: '30px', marginBottom: '30px' }}>
          <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Progreso hacia Meta</h2>
          {sorted.map((a, i) => <div key={a.ticker} style={{ marginBottom: '20px' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: 'white', fontWeight: 'bold' }}>{i < 3 ? ['🥇','🥈','🥉'][i] : '🏇'} {a.ticker} - {a.name}</span><span style={{ color: a.color, fontWeight: 'bold' }}>{getProgress(a).toFixed(1)}%</span></div><div style={{ height: '32px', background: 'rgba(51, 65, 85, 0.5)', borderRadius: '20px', overflow: 'hidden' }}><div style={{ height: '100%', width: getProgress(a) + '%', background: 'linear-gradient(to right, ' + a.color + '88, ' + a.color + ')', transition: 'width 0.5s' }} /></div></div>)}
        </div>
        <div style={{ background: 'rgba(30, 41, 59, 0.6)', borderRadius: '20px', padding: '30px' }}>
          <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Precios (Click para editar)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {assets.map(a => <div key={a.ticker} style={{ background: 'rgba(51, 65, 85, 0.5)', borderRadius: '12px', padding: '20px' }}><div style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>{a.ticker}</div><div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '12px' }}>{a.name}</div><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ color: '#94a3b8' }}>Inicio:</span><span style={{ color: 'white' }}>{'$'}{a.start.toLocaleString()}</span></div><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ color: '#94a3b8' }}>Actual:</span>{editing === a.ticker ? <span><input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} onKeyPress={e => e.key === 'Enter' && updatePrice(a.ticker)} style={{ width: '80px', background: '#334155', color: 'white', border: 'none', borderRadius: '4px', padding: '4px' }} autoFocus /><button onClick={() => updatePrice(a.ticker)} style={{ marginLeft: '4px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px' }}>OK</button></span> : <span onClick={() => { setEditing(a.ticker); setNewPrice(a.current.toString()) }} style={{ color: 'white', cursor: 'pointer' }}>{'$'}{a.current.toLocaleString()} ✏️</span>}</div><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>Meta:</span><span style={{ color: 'white' }}>{'$'}{a.target.toLocaleString()}</span></div></div>)}
          </div>
        </div>
      </div>
    </div>
  )
}

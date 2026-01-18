'use client'
import React, { useState } from 'react'

type Asset = { ticker: string; name: string; start: number; current: number; target: number; color: string }

export default function HorseRace() {
      const [assets, setAssets] = useState<Asset[]>([
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
      const [editing, setEditing] = useState<string | null>(null)
      const [newPrice, setNewPrice] = useState('')

  const updatePrice = (ticker: string) => {
          const price = parseFloat(newPrice)
          if (!isNaN(price) && price > 0) {
                    setAssets(assets.map((a: Asset) => a.ticker === ticker ? { ...a, current: price } : a))
          }
          setEditing(null)
  }

  const getProgress = (a: Asset) => Math.min(Math.max(((a.current - a.start) / (a.target - a.start)) * 100, 0), 100)
      const getChange = (a: Asset) => ((a.current - a.start) / a.start) * 100
      const sorted = [...assets].sort((a: Asset, b: Asset) => getProgress(b) - getProgress(a))

  return (
          <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '40px 20px' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                              <h1 style={{ color: 'white', fontSize: '48px', fontWeight: 'bold', marginBottom: '10px' }}>Carrera a la Meta 2026</h1>h1>
                                              <p style={{ color: '#94a3b8', fontSize: '18px' }}>Portfolio Tracker 14 Enero - 31 Diciembre 2026</p>p>
                                </div>div>
                                <div style={{ background: 'rgba(30, 41, 59, 0.6)', borderRadius: '20px', padding: '30px', marginBottom: '30px' }}>
                                              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Progreso hacia Meta</h2>h2>
                                    {sorted.map((a: Asset) => (
                          <div key={a.ticker} style={{ marginBottom: '20px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                                <span style={{ color: 'white', fontWeight: 'bold' }}>{a.ticker} - {a.name}</span>span>
                                                                <span style={{ color: '#94a3b8' }}>${a.current.toLocaleString()} / ${a.target.toLocaleString()}</span>span>
                                            </div>div>
                                            <div style={{ background: 'rgba(51, 65, 85, 0.5)', borderRadius: '10px', height: '24px', overflow: 'hidden' }}>
                                                                <div style={{ background: a.color, height: '100%', width: `${getProgress(a)}%`, borderRadius: '10px' }}></div>div>
                                            </div>div>
                          </div>div>
                        ))}
                                </div>div>
                                <div style={{ background: 'rgba(30, 41, 59, 0.6)', borderRadius: '20px', padding: '30px' }}>
                                              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Precios (Click para editar)</h2>h2>
                                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                                  {assets.map((a: Asset) => (
                            <div key={a.ticker} style={{ background: 'rgba(51, 65, 85, 0.5)', borderRadius: '12px', padding: '20px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                                      <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>{a.ticker}</span>span>
                                                                      <span style={{ color: getChange(a) >= 0 ? '#4ade80' : '#f87171', fontSize: '14px' }}>
                                                                          {getChange(a) >= 0 ? '+' : ''}{getChange(a).toFixed(1)}%
                                                                      </span>span>
                                                </div>div>
                                {editing === a.ticker ? (
                                                  <div style={{ display: 'flex', gap: '8px' }}>
                                                                          <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: '#1e293b', color: 'white' }} />
                                                                          <button onClick={() => updatePrice(a.ticker)} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#8b5cf6', color: 'white', cursor: 'pointer' }}>OK</button>button>
                                                  </div>div>
                                                ) : (
                                                  <div onClick={() => { setEditing(a.ticker); setNewPrice(a.current.toString()) }} style={{ cursor: 'pointer', padding: '8px', background: '#1e293b', borderRadius: '6px', textAlign: 'center' }}>
                                                                          <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>${a.current.toLocaleString()}</span>span>
                                                  </div>div>
                                                )}
                            </div>div>
                          ))}
                                              </div>div>
                                </div>div>
                    </div>div>
          </div>div>
        )
}

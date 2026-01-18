'use client'
import React, { useState } from 'react'
type Asset = { ticker: string; name: string; start: number; current: number; target: number; color: string }
export default function HorseRace() {
    const [assets, setAssets] = useState<Asset[]>([
      { ticker: 'PLTR', name: 'Palantir', start: 178, current: 178, target: 300, color: '#8B5CF6' },
      { ticker: 'HOOD', name: 'Robinhood', start: 120, current: 120, target: 240, color: '#22C55E' },
      { ticker: 'TSLA', name: 'Tesla', start: 441, current: 441, target: 850, color: '#EF4444' },
      { ticker: 'BTC', name: 'Bitcoin', start: 95000, current: 95000, target: 250000, color: '#F59E0B' },
      { ticker: 'SOL', name: 'Solana', start: 145, current: 145, target: 450, color: '#9333EA' },
        ])
    const getProgress = (a: Asset) => Math.min(Math.max(((a.current - a.start) / (a.target - a.start)) * 100, 0), 100)
    const sorted = [...assets].sort((a: Asset, b: Asset) => getProgress(b) - getProgress(a))
    return (
          <div style={{ minHeight: '100vh', background: '#1e293b', padding: '40px' }}>
                  <h1 style={{ color: 'white', textAlign: 'center' }}>Carrera a la Meta 2026</h1>
            {sorted.map((a: Asset) => (
                    <div key={a.ticker} style={{ margin: '20px 0' }}>
                                <span style={{ color: 'white' }}>{a.ticker}</span>
                                <div style={{ background: '#334155', height: '20px', borderRadius: '10px' }}>
                                              <div style={{ background: a.color, height: '100%', width: `${getProgress(a)}%`, borderRadius: '10px' }}></div>
                                </div>
                    </div>
                  ))}
          </div>
        )
}

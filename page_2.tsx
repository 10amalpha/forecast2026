'use client'
import React, { useState } from 'react'

type Asset = { ticker: string; name: string; start: number; current: number; target: number; color: string; icon: string }

const HorseRace = () => {
  const [assets, setAssets] = useState<Asset[]>([
    { ticker: 'PLTR', name: 'Palantir', start: 178, current: 178, target: 300, color: '#8B5CF6', icon: '🚀' },
    { ticker: 'HOOD', name: 'Robinhood', start: 120, current: 120, target: 240, color: '#22C55E', icon: '⚡' },
    { ticker: 'TSLA', name: 'Tesla', start: 441, current: 441, target: 850, color: '#EF4444', icon: '🌀' },
    { ticker: 'STKE', name: 'Sol Strategies', start: 2.4, current: 2.4, target: 10, color: '#3B82F6', icon: '🏃' },
    { ticker: 'QSI', name: 'Quantum-Si', start: 1.27, current: 1.27, target: 7.5, color: '#EC4899', icon: '🏃' },
    { ticker: 'HIMS', name: 'Hims & Hers', start: 32, current: 32, target: 75, color: '#14B8A6', icon: '🏃' },
    { ticker: 'BTC', name: 'Bitcoin', start: 95000, current: 95000, target: 250000, color: '#F59E0B', icon: '₿' },
    { ticker: 'SOL', name: 'Solana', start: 145, current: 145, target: 450, color: '#9333EA', icon: '◎' },
    { ticker: 'JUP', name: 'Jupiter', start: 0.23, current: 0.23, target: 5, color: '#6366F1', icon: '🪐' },
    { ticker: 'NOS', name: 'Nosana', start: 0.36, current: 0.36, target: 4, color: '#84CC16', icon: '🤖' },
    { ticker: 'SHDW', name: 'Shadow', start: 0.51, current: 0.51, target: 1.5, color: '#6B7280', icon: '👻' },
  ])
  const [editing, setEditing] = useState<string | null>(null)
  const [newPrice, setNewPrice] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [updateStatus, setUpdateStatus] = useState('')

  const fetchLivePrices = async () => {
    setIsLoading(true)
    setUpdateStatus('🔄 Claude buscando precios...')
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{
            role: "user",
            content: `Busca los precios actuales de mercado para estos activos usando web search:
Acciones (US markets): PLTR, HOOD, TSLA, STKE, QSI, HIMS
Criptomonedas: BTC (Bitcoin), SOL (Solana), JUP (Jupiter), NOS (Nosana), SHDW (Shadow)

Retorna SOLO un objeto JSON sin markdown ni explicación:
{"PLTR": precio, "HOOD": precio, "TSLA": precio, "STKE": precio, "QSI": precio, "HIMS": precio, "BTC": precio, "SOL": precio, "JUP": precio, "NOS": precio, "SHDW": precio}

Usa los precios más recientes que encuentres.`
          }]
        })
      })

      const data = await response.json()
      const textBlocks = data.content.filter((c: {type: string}) => c.type === 'text')
      let prices = null

      for (const block of textBlocks) {
        const jsonMatch = block.text.match(/\{[\s\S]*?\}/)
        if (jsonMatch) {
          try {
            prices = JSON.parse(jsonMatch[0])
            break
          } catch { continue }
        }
      }

      if (prices) {
        let updated = 0
        setAssets(prev => prev.map(a => {
          if (prices[a.ticker] && !isNaN(prices[a.ticker])) {
            updated++
            return { ...a, current: prices[a.ticker] }
          }
          return a
        }))
        setUpdateStatus(`✅ ${updated} precios actualizados`)
      } else {
        setUpdateStatus('⚠️ No se encontraron precios. Usa edición manual')
      }
    } catch {
      setUpdateStatus('⚠️ Error. Usa edición manual')
    }
    setIsLoading(false)
    setTimeout(() => setUpdateStatus(''), 5000)
  }

  const updatePrice = (ticker: string) => {
    const price = parseFloat(newPrice)
    if (!isNaN(price) && price > 0) {
      setAssets(assets.map(a => a.ticker === ticker ? { ...a, current: price } : a))
    }
    setEditing(null)
    setNewPrice('')
  }

  const getProgress = (asset: Asset) => {
    const total = asset.target - asset.start
    const gained = asset.current - asset.start
    return Math.min(Math.max((gained / total) * 100, 0), 100)
  }

  const getChange = (asset: Asset) => {
    return ((asset.current - asset.start) / asset.start) * 100
  }

  const getMultiple = (asset: Asset) => {
    return asset.current / asset.start
  }

  const getTargetMultiple = (asset: Asset) => {
    return asset.target / asset.start
  }

  const sortedByProgress = [...assets].sort((a, b) => getProgress(b) - getProgress(a))
  const sortedByChange = [...assets].sort((a, b) => getChange(b) - getChange(a))
  const sortedByMultiple = [...assets].sort((a, b) => getMultiple(b) - getMultiple(a))

  const getMedal = (i: number) => i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'
  const getSpeedIcon = (i: number) => i === 0 ? '🚀' : i === 1 ? '⚡' : '🌀'

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: 'white', fontSize: '48px', fontWeight: 'bold', marginBottom: '10px' }}>🏇 Carrera a la Meta 2026</h1>
          <p style={{ color: '#94a3b8', fontSize: '18px' }}>Portfolio Tracker 14 Enero - 31 Diciembre 2026</p>
          <button
            onClick={fetchLivePrices}
            disabled={isLoading}
            style={{
              background: isLoading ? '#64748b' : 'linear-gradient(to right, #7c3aed, #ec4899)',
              color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none',
              fontSize: '16px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)', transition: 'all 0.3s', marginTop: '20px'
            }}
          >
            {isLoading ? '⏳ Actualizando...' : '🔄 Actualizar Precios con Claude'}
          </button>
          {updateStatus && <div style={{ color: '#10b981', marginTop: '12px', fontSize: '14px', fontWeight: '500' }}>{updateStatus}</div>}
        </div>

        {/* Top 3 Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', maxWidth: '800px', margin: '0 auto 40px' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.1))', borderRadius: '16px', padding: '20px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>🎯 Top 3 Progreso a Meta</h3>
            {sortedByProgress.slice(0, 3).map((a, i) => (
              <div key={a.ticker} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ color: 'white', fontWeight: '600' }}>{getMedal(i)} {a.ticker}</span>
                  <span style={{ color: '#22c55e', fontWeight: 'bold' }}>{getProgress(a).toFixed(1)}%</span>
                </div>
                <div style={{ background: '#334155', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ background: a.color, height: '100%', width: `${getProgress(a)}%`, borderRadius: '4px' }}></div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.1))', borderRadius: '16px', padding: '20px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
            <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>⚡ Top 3 Velocidad (ROI)</h3>
            {sortedByChange.slice(0, 3).map((a, i) => (
              <div key={a.ticker} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ color: 'white', fontWeight: '600' }}>{getSpeedIcon(i)} {a.ticker}</span>
                  <span style={{ color: getChange(a) >= 0 ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>{getChange(a).toFixed(1)}%</span>
                </div>
                <div style={{ background: '#334155', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ background: getChange(a) >= 0 ? '#22c55e' : '#ef4444', height: '100%', width: `${Math.min(Math.abs(getChange(a)), 100)}%`, borderRadius: '4px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progreso hacia Meta */}
        <div style={{ background: 'rgba(30, 41, 59, 0.6)', borderRadius: '20px', padding: '30px', marginBottom: '30px' }}>
          <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>🎯 Progreso hacia Meta</h2>
          {sortedByProgress.map((a) => (
            <div key={a.ticker} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>{a.icon}</span>
                  <span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>{a.ticker}</span>
                  <span style={{ color: '#94a3b8', fontSize: '14px' }}>{a.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {editing === a.ticker ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && updatePrice(a.ticker)}
                        style={{ width: '100px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #475569', background: '#1e293b', color: 'white' }} autoFocus />
                      <button onClick={() => updatePrice(a.ticker)} style={{ padding: '4px 12px', background: '#22c55e', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>OK</button>
                    </div>
                  ) : (
                    <span onClick={() => { setEditing(a.ticker); setNewPrice(a.current.toString()) }} style={{ color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>${a.current.toLocaleString()}</span>
                  )}
                  <span style={{ color: '#94a3b8' }}>Meta: ${a.target.toLocaleString()}</span>
                  <span style={{ color: getProgress(a) > 50 ? '#22c55e' : getProgress(a) > 0 ? '#f59e0b' : '#ef4444', fontWeight: 'bold', minWidth: '60px', textAlign: 'right' }}>{getProgress(a).toFixed(1)}%</span>
                </div>
              </div>
              <div style={{ background: '#334155', height: '20px', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ background: `linear-gradient(90deg, ${a.color}, ${a.color}dd)`, height: '100%', width: `${getProgress(a)}%`, borderRadius: '10px', transition: 'width 0.5s ease' }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Velocidad (Múltiplos Ganados) */}
        <div style={{ background: 'rgba(30, 41, 59, 0.6)', borderRadius: '20px', padding: '30px' }}>
          <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>⚡ Velocidad (Múltiplos Ganados)</h2>
          {sortedByMultiple.map((a) => (
            <div key={a.ticker} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>{a.icon}</span>
                  <span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>{a.ticker}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ color: getMultiple(a) >= 1 ? '#22c55e' : '#ef4444', fontWeight: 'bold', fontSize: '18px' }}>{getMultiple(a).toFixed(2)}x</span>
                  <span style={{ color: '#94a3b8', fontSize: '14px' }}>Target: {getTargetMultiple(a).toFixed(2)}x</span>
                </div>
              </div>
              <div style={{ background: '#334155', height: '20px', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ background: `linear-gradient(90deg, ${a.color}, ${a.color}dd)`, height: '100%', width: `${Math.min((getMultiple(a) / getTargetMultiple(a)) * 100, 100)}%`, borderRadius: '10px', transition: 'width 0.5s ease' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HorseRace

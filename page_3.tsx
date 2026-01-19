'use client'
import React, { useState } from 'react'

type Asset = { ticker: string; name: string; start: number; current: number; target: number; color: string; apiSymbol: string }

export default function HorseRace() {
  const [assets, setAssets] = useState<Asset[]>([
    { ticker: 'PLTR', name: 'Palantir', start: 80.55, current: 80.55, target: 300, color: '#8B5CF6', apiSymbol: 'PLTR' },
    { ticker: 'HOOD', name: 'Robinhood', start: 40.70, current: 40.70, target: 240, color: '#22C55E', apiSymbol: 'HOOD' },
    { ticker: 'TSLA', name: 'Tesla', start: 411, current: 411, target: 850, color: '#EF4444', apiSymbol: 'TSLA' },
    { ticker: 'STKE', name: 'Sol Strategies', start: 5.70, current: 5.70, target: 25, color: '#3B82F6', apiSymbol: 'HODL.NE' },
    { ticker: 'QSI', name: 'Quantum-Si', start: 2.92, current: 2.92, target: 15, color: '#EC4899', apiSymbol: 'QSI' },
    { ticker: 'HIMS', name: 'Hims & Hers', start: 26.20, current: 26.20, target: 75, color: '#14B8A6', apiSymbol: 'HIMS' },
    { ticker: 'BTC', name: 'Bitcoin', start: 94500, current: 94500, target: 250000, color: '#F59E0B', apiSymbol: 'BTC-USD' },
    { ticker: 'SOL', name: 'Solana', start: 203, current: 203, target: 450, color: '#9333EA', apiSymbol: 'SOL-USD' },
    { ticker: 'JUP', name: 'Jupiter', start: 0.88, current: 0.88, target: 5, color: '#6366F1', apiSymbol: 'JUP-USD' },
    { ticker: 'NOS', name: 'Nosana', start: 2.82, current: 2.82, target: 10, color: '#84CC16', apiSymbol: 'NOS-USD' },
    { ticker: 'SHDW', name: 'Shadow', start: 0.37, current: 0.37, target: 3, color: '#6B7280', apiSymbol: 'SHDW-USD' },
  ])
  const [editing, setEditing] = useState<string | null>(null)
  const [newPrice, setNewPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  
  const startDate = new Date('2025-01-14')
  const endDate = new Date('2026-12-31')
  const today = new Date()
  const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  const elapsedDays = Math.max(0, (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  
  const getProgress = (a: Asset) => Math.min(Math.max(((a.current - a.start) / (a.target - a.start)) * 100, 0), 100)
  const getChange = (a: Asset) => ((a.current - a.start) / a.start) * 100
  
  // Velocidad: progreso actual vs progreso esperado basado en tiempo
  const getVelocity = (a: Asset) => {
    const expectedProgress = (elapsedDays / totalDays) * 100
    const actualProgress = getProgress(a)
    if (expectedProgress === 0) return 0
    return (actualProgress / expectedProgress) * 100 - 100 // % ahead/behind schedule
  }
  
  const sorted = [...assets].sort((a, b) => getProgress(b) - getProgress(a))
  const sortedByVelocity = [...assets].sort((a, b) => getVelocity(b) - getVelocity(a))
  
  const updatePrice = (ticker: string) => {
    const price = parseFloat(newPrice)
    if (!isNaN(price) && price > 0) {
      setAssets(assets.map(a => a.ticker === ticker ? { ...a, current: price } : a))
    }
    setEditing(null)
    setNewPrice('')
  }

  const fetchPrices = async () => {
    setLoading(true)
    try {
      const stocks = ['PLTR', 'HOOD', 'TSLA', 'QSI', 'HIMS']
      const cryptos = ['bitcoin', 'solana', 'jupiter-exchange-solana']
      
      // Fetch stocks from Yahoo Finance via API
      const stockPromises = stocks.map(async (symbol) => {
        try {
          const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`)
          const data = await res.json()
          return { symbol, price: data?.chart?.result?.[0]?.meta?.regularMarketPrice || null }
        } catch { return { symbol, price: null } }
      })
      
      // Fetch crypto from CoinGecko
      const cryptoRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptos.join(',')}&vs_currencies=usd`)
      const cryptoData = await cryptoRes.json()
      
      const stockResults = await Promise.all(stockPromises)
      
      setAssets(prev => prev.map(asset => {
        // Stocks
        const stockMatch = stockResults.find(s => s.symbol === asset.apiSymbol)
        if (stockMatch?.price) return { ...asset, current: stockMatch.price }
        
        // Crypto
        if (asset.ticker === 'BTC' && cryptoData.bitcoin) return { ...asset, current: cryptoData.bitcoin.usd }
        if (asset.ticker === 'SOL' && cryptoData.solana) return { ...asset, current: cryptoData.solana.usd }
        if (asset.ticker === 'JUP' && cryptoData['jupiter-exchange-solana']) return { ...asset, current: cryptoData['jupiter-exchange-solana'].usd }
        
        return asset
      }))
      
      setLastUpdate(new Date().toLocaleString())
    } catch (err) {
      console.error('Error fetching prices:', err)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: 'white', fontSize: '48px', fontWeight: 'bold', marginBottom: '10px' }}>🏇 Carrera a la Meta 2026</h1>
          <p style={{ color: '#94a3b8', fontSize: '18px' }}>Portfolio Tracker 14 Enero 2025 - 31 Diciembre 2026</p>
          <button 
            onClick={fetchPrices} 
            disabled={loading}
            style={{ marginTop: '20px', padding: '12px 24px', background: loading ? '#475569' : '#22c55e', color: 'white', borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: 'bold' }}
          >
            {loading ? '⏳ Actualizando...' : '🔄 Actualizar Precios'}
          </button>
          {lastUpdate && <p style={{ color: '#64748b', fontSize: '14px', marginTop: '10px' }}>Última actualización: {lastUpdate}</p>}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.1))', borderRadius: '16px', padding: '20px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>🏆 Top Performers</h3>
            {sorted.slice(0, 3).map((a, i) => (<div key={a.ticker} style={{ marginBottom: '12px' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ color: 'white', fontWeight: '600' }}>{i + 1}. {a.ticker}</span><span style={{ color: '#22c55e', fontWeight: 'bold' }}>{getProgress(a).toFixed(1)}%</span></div></div>))}
          </div>
          <div style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.1))', borderRadius: '16px', padding: '20px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
            <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>📈 Biggest Movers</h3>
            {[...assets].sort((a, b) => getChange(b) - getChange(a)).slice(0, 3).map((a, i) => (<div key={a.ticker} style={{ marginBottom: '12px' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ color: 'white', fontWeight: '600' }}>{i + 1}. {a.ticker}</span><span style={{ color: getChange(a) >= 0 ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>{getChange(a) >= 0 ? '+' : ''}{getChange(a).toFixed(1)}%</span></div></div>))}
          </div>
          <div style={{ background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(234, 88, 12, 0.1))', borderRadius: '16px', padding: '20px', border: '1px solid rgba(249, 115, 22, 0.3)' }}>
            <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>🚀 Velocidad</h3>
            {sortedByVelocity.slice(0, 3).map((a, i) => (<div key={a.ticker} style={{ marginBottom: '12px' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ color: 'white', fontWeight: '600' }}>{i + 1}. {a.ticker}</span><span style={{ color: getVelocity(a) >= 0 ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>{getVelocity(a) >= 0 ? '+' : ''}{getVelocity(a).toFixed(0)}%</span></div></div>))}
            <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '8px', textAlign: 'center' }}>vs ritmo esperado</p>
          </div>
        </div>
        
        <div style={{ background: 'rgba(30, 41, 59, 0.6)', borderRadius: '20px', padding: '30px', marginBottom: '30px' }}>
          <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Progreso hacia Metas</h2>
          {sorted.map((a) => (<div key={a.ticker} style={{ marginBottom: '20px' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>{a.ticker}</span><span style={{ color: '#94a3b8', fontSize: '14px' }}>{a.name}</span></div><div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>{editing === a.ticker ? (<div style={{ display: 'flex', gap: '8px' }}><input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && updatePrice(a.ticker)} style={{ width: '100px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #475569', background: '#1e293b', color: 'white' }} autoFocus /><button onClick={() => updatePrice(a.ticker)} style={{ padding: '4px 12px', background: '#22c55e', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>OK</button></div>) : (<span onClick={() => { setEditing(a.ticker); setNewPrice(a.current.toString()) }} style={{ color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>${a.current.toLocaleString()}</span>)}<span style={{ color: '#94a3b8' }}>Meta: ${a.target.toLocaleString()}</span><span style={{ color: getProgress(a) > 50 ? '#22c55e' : '#f59e0b', fontWeight: 'bold', minWidth: '60px', textAlign: 'right' }}>{getProgress(a).toFixed(1)}%</span></div></div><div style={{ background: '#334155', height: '20px', borderRadius: '10px', overflow: 'hidden' }}><div style={{ background: a.color, height: '100%', width: `${getProgress(a)}%`, borderRadius: '10px', transition: 'width 0.5s ease' }}></div></div></div>))}
        </div>
        
        <div style={{ background: 'rgba(30, 41, 59, 0.6)', borderRadius: '20px', padding: '30px' }}>
          <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Precios (Click para editar)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {assets.map((a) => (<div key={a.ticker} style={{ background: 'rgba(51, 65, 85, 0.5)', borderRadius: '12px', padding: '16px', border: `2px solid ${a.color}30` }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}><span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>{a.ticker}</span><span style={{ color: getChange(a) >= 0 ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>{getChange(a) >= 0 ? '+' : ''}{getChange(a).toFixed(1)}%</span></div><div style={{ color: '#94a3b8', fontSize: '14px' }}>{a.name}</div><div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>Inicio: ${a.start.toLocaleString()}</span><span style={{ color: 'white', fontWeight: 'bold' }}>${a.current.toLocaleString()}</span></div></div>))}
          </div>
        </div>
      </div>
    </div>
  )
}

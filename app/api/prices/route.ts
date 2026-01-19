import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const prices: Record<string, number> = {}
    
    // Fetch stock prices from Yahoo Finance
    const stocks = ['PLTR', 'HOOD', 'TSLA', 'STKE', 'QSI', 'HIMS']
    for (const symbol of stocks) {
      try {
        const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`)
        const data = await res.json()
        const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice
        if (price) prices[symbol] = price
      } catch { /* skip */ }
    }
    
    // Fetch crypto prices from CoinGecko
    try {
      const cryptoRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,solana,jupiter-exchange-solana,nosana,genesysgo-shadow&vs_currencies=usd')
      const cryptoData = await cryptoRes.json()
      if (cryptoData.bitcoin?.usd) prices['BTC'] = cryptoData.bitcoin.usd
      if (cryptoData.solana?.usd) prices['SOL'] = cryptoData.solana.usd
      if (cryptoData['jupiter-exchange-solana']?.usd) prices['JUP'] = cryptoData['jupiter-exchange-solana'].usd
      if (cryptoData.nosana?.usd) prices['NOS'] = cryptoData.nosana.usd
      if (cryptoData['genesysgo-shadow']?.usd) prices['SHDW'] = cryptoData['genesysgo-shadow'].usd
    } catch { /* skip */ }
    
    if (Object.keys(prices).length === 0) {
      return NextResponse.json({ error: 'No se pudieron obtener precios' }, { status: 400 })
    }
    
    return NextResponse.json({ prices })
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener precios' }, { status: 500 })
  }
}

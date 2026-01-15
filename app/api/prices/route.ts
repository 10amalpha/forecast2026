import { NextResponse } from 'next/server'

export async function POST() {
    try {
          const response = await fetch("https://api.anthropic.com/v1/messages", {
                  method: "POST",
                  headers: {
                            "Content-Type": "application/json",
                            "x-api-key": process.env.ANTHROPIC_API_KEY || "",
                            "anthropic-version": "2023-06-01"
                  },
                  body: JSON.stringify({
                            model: "claude-sonnet-4-20250514",
                            max_tokens: 2000,
                            tools: [{ "type": "web_search_20250305", "name": "web_search" }],
                            messages: [{
                                        role: "user",
                                        content: `Busca los precios actuales de mercado para estos activos usando web search:
                                        Acciones (US markets): PLTR, HOOD, TSLA, STKE, QSI, HIMS
                                        Criptomonedas: BTC (Bitcoin), SOL (Solana), JUP (Jupiter), NOS (Nosana), SHDW (Shadow/GenesysGo)
                                        Retorna SOLO un objeto JSON sin markdown ni explicacion:
                                        {"PLTR": precio, "HOOD": precio, "TSLA": precio, "STKE": precio, "QSI": precio, "HIMS": precio, "BTC": precio, "SOL": precio, "JUP": precio, "NOS": precio, "SHDW": precio}
                                        Usa los precios mas recientes que encuentres.`
                            }]
                  })
          })
          const data = await response.json()
          if (data.error) { return NextResponse.json({ error: data.error.message }, { status: 400 }) }
          const textBlocks = data.content?.filter((c: any) => c.type === 'text') || []
                let prices = null
          for (const block of textBlocks) {
                  const jsonMatch = block.text.match(/\{[\s\S]*?\}/)
                  if (jsonMatch) { try { prices = JSON.parse(jsonMatch[0]); break } catch (e) { continue } }
          }
          if (!prices) { return NextResponse.json({ error: 'No se pudo extraer precios' }, { status: 400 }) }
          return NextResponse.json({ prices })
    } catch (error) {
          return NextResponse.json({ error: 'Error al obtener precios' }, { status: 500 })
    }
}

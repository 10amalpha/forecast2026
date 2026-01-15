import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: '🏇 Carrera a la Meta 2026 | 10AMPRO',
    description: 'Portfolio Tracker - Enero a Diciembre 2026',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
          <html lang="es">
                <body style={{ margin: 0, padding: 0 }}>{children}</body>body>
          </html>html>
        )
}</html>

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Biodata Rombel 3 – PPKN',
  description: 'Data biodata siswa kelas Rombel 3 PPKN',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}

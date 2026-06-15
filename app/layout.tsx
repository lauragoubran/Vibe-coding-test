import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Homs Centre Survey — Alsama',
  description: 'Staff sentiment survey for the Homs centre opening',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fdf8f3] antialiased">{children}</body>
    </html>
  )
}

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Trello Clone - Kanban Board',
  description: 'A production-grade Trello clone built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}

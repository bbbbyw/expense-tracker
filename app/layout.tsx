import type { Metadata } from 'next'
import './globals.css'
import { Navigation } from '@/components/layout/Navigation'
import { ToastProvider } from '@/components/ui/Toast'

export const metadata: Metadata = {
  title: 'Expense Tracker',
  description: 'Track and manage your expenses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <Navigation />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  )
}


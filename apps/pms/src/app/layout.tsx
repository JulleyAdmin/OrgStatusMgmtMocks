import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../components/AuthProvider'
import { AuthGuard } from '../components/AuthGuard'
import { CompanyProvider } from '../contexts/CompanyContext'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { Toaster } from 'react-hot-toast'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins'
})

export const metadata: Metadata = {
  title: 'Autocracy PMS - Project Management System',
  description: 'Project Management System for Manufacturing & Technology Operations',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ErrorBoundary>
          <AuthProvider>
            <AuthGuard>
              <CompanyProvider>
                {children}
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                  }}
                />
              </CompanyProvider>
            </AuthGuard>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

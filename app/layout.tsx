import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers/auth-provider'
import { DashboardProvider } from '@/components/providers/dashboard-provider'

const fontSans = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
})

const fontHeading = Outfit({
  variable: '--font-heading',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Golf Charity Subscription Platform',
  description: 'Make an impact while playing the game you love.',
}

import { Navbar } from '@/components/layout/navbar'
import { Toaster } from 'sonner'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className={`${fontSans.variable} ${fontHeading.variable} min-h-full font-sans antialiased bg-background text-foreground flex flex-col`}>
        <AuthProvider>
          <DashboardProvider>
            <Navbar />
            <Toaster position="top-center" richColors />
            <main className="flex-1 pt-24 md:pt-28">
              {children}
            </main>
          </DashboardProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

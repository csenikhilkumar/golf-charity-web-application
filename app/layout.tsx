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
  title: 'Golf Charity | Impact through Play',
  description: 'Make an impact while playing the game you love.',
  icons: {
    icon: '/favicon.png',
  },
}

import { Navbar } from '@/components/layout/navbar'
import { Toaster } from 'sonner'

import Script from 'next/script'
import { ThemeProvider } from '@/components/providers/theme-provider'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <head>
        <Script id="auth-redirect" strategy="beforeInteractive" dangerouslySetInnerHTML={{
          __html: `
            if (window.location.pathname === '/') {
              try {
                for (let i = 0; i < localStorage.length; i++) {
                  const key = localStorage.key(i);
                  if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
                    const token = localStorage.getItem(key);
                    if (token && JSON.parse(token).access_token) {
                      window.location.replace('/dashboard');
                    }
                  }
                }
              } catch (e) {}
            }
          `
        }} />
      </head>
      <body className={`${fontSans.variable} ${fontHeading.variable} min-h-full font-sans antialiased bg-background text-foreground flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <DashboardProvider>
              <Navbar />
              <Toaster position="top-center" richColors />
              <main className="flex-1 pt-24 md:pt-28">
                {children}
              </main>
            </DashboardProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

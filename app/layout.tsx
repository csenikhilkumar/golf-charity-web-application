import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${fontSans.variable} ${fontHeading.variable} min-h-full font-sans antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  )
}

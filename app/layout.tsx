import type { Metadata } from 'next'
import { Providers } from './providers'
import { SoundToggle } from '@/components/ui/SoundToggle'
import './globals.css'

export const metadata: Metadata = {
  title: 'DATAVISM | Data Activism Powered by AI',
  description: 'They profit from your data. Now you fight back. Wield AI as your superpower to expose corruption, fight manipulation, and change the world.',
  keywords: 'datavism, data activism, AI, resistance, surveillance, privacy',
  authors: [{ name: 'DATAVISM' }],
  openGraph: {
    title: 'DATAVISM',
    description: 'They profit from your data. Now you fight back.',
    url: 'https://datavism.org',
    siteName: 'DATAVISM',
    images: ['/og-image.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DATAVISM',
    description: 'They profit from your data. Now you fight back.',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="font-mono">
      <body className="bg-black text-green-400 overflow-x-hidden min-h-screen" suppressHydrationWarning={true}>
        <Providers>
          {children}
          <SoundToggle />
        </Providers>
      </body>
    </html>
  )
}

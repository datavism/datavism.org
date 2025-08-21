import type { Metadata } from 'next'
import { Navigation } from '../components/layout/Navigation'
import { Footer } from '../components/layout/Footer'
import { CRTEffect } from '../components/layout/CRTEffect'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'DATAVISM | Learn Data Science by Exposing Corruption',
  description: 'The revolution will be computed. Learn Python, SQL, and ML by investigating real corruption. Join 2,847+ investigators worldwide.',
  keywords: 'data science, python, investigation, corruption, transparency',
  authors: [{ name: 'The Data Underground' }],
  openGraph: {
    title: 'DATAVISM',
    description: 'Learn data science by exposing real corruption',
    url: 'https://datavism.org',
    siteName: 'DATAVISM',
    images: ['/og-image.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DATAVISM',
    description: 'The revolution will be computed',
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
      <body className="bg-black text-green-400 overflow-x-hidden cursor-crosshair min-h-screen" suppressHydrationWarning={true}>
        <Providers>
          <CRTEffect />
          <Navigation />
          <main className="relative z-10">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata = {
  title: 'DATAVISM — The Data Underground',
  description:
    'The school of the Data Underground. You won’t learn to code — you’ll learn to command: AI, data, and the right questions. The revolution will be computed. Opening soon.',
  metadataBase: new URL('https://datavism.org'),
  openGraph: {
    title: 'DATAVISM — The Data Underground',
    description: 'The revolution will be computed. Opening soon.',
    url: 'https://datavism.org',
    siteName: 'DATAVISM',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: '#050805',
          color: '#9ef0a8',
          fontFamily:
            "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          minHeight: '100vh',
        }}
      >
        {children}
      </body>
    </html>
  )
}

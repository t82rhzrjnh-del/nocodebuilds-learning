import type { Metadata } from 'next'
import { Geist, JetBrains_Mono, Silkscreen } from 'next/font/google'
import './globals.css'

const siteUrl = 'https://skills.nocodebuilds.dev'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const jetbrainsMono = JetBrains_Mono({ variable: '--font-jetbrains', subsets: ['latin'] })
const silkscreen = Silkscreen({ variable: '--font-silkscreen', subsets: ['latin'], weight: ['400', '700'] })

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Claude Toolkit — nocodebuilds', template: '%s | nocodebuilds' },
  description: 'The plain-English guide to Claude Skills, MCPs, APIs, and automations. Built by nocodebuilds for AI beginners.',
  keywords: ['Claude skills', 'MCP', 'Claude API', 'AI automation', 'nocodebuilds', 'no-code AI'],
  openGraph: {
    type: 'website', url: siteUrl,
    title: 'Claude Toolkit — nocodebuilds',
    description: 'Skills. MCPs. APIs. Automations. All explained simply.',
    siteName: 'nocodebuilds', locale: 'en_GB',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${jetbrainsMono.variable} ${silkscreen.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}

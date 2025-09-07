import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import ErrorBoundary from "@/components/error-boundary"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "MovieHub - Discover Amazing Movies",
  description:
    "Discover the latest movies, explore detailed information, and find your next favorite film with MovieHub.",
  generator: "v0.app",
  keywords: ["movies", "cinema", "entertainment", "film", "reviews"],
  authors: [{ name: "MovieHub Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#0ea5e9",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <link rel="icon" href="/move-wepsite/icon/wepsite-icon.png" />
      </head>
      <body className="font-sans antialiased">
        <Suspense fallback={<div>Loading...</div>}>
          <ErrorBoundary>{children}</ErrorBoundary>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}

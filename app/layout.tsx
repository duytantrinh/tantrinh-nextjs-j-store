import type {Metadata} from "next"
import {Inter} from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar/NavBar"
import Container from "@/components/global/Container"
import Providers from "./providers"
import {ClerkProvider} from "@clerk/nextjs"

import Topheader from "@/components/Topheader/Topheader"

const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
  title: "Next J Store",
  description: "Ecommerce store built with Nextjs",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClerkProvider>
          <Providers>
            <Topheader />
            <Navbar />
            <Container className="py-20">{children}</Container>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import Providers from '@/components/Providers'
import './globals.css'
import TopNav from '@/components/layout/navbar/TopNav'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'JCB',
  description: 'JCB',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <html lang='en' className='bg-black text-white'>
        <body className='font-Lato'>
          <Providers>
            <TopNav />
            <main className='mx-4 mb-12'>{children}</main>
            <Footer />
          </Providers>
        </body>
      </html>
    </SessionProvider>
  )
}

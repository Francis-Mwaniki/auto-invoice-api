import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Quicksand } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { Metadata } from 'next'

const quicksand = Quicksand({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Auto Invoice API',
  description: 'Streamline your invoicing process with our powerful API and dashboard.',
  keywords: ['invoice', 'API', 'dashboard', 'accounting', 'fintech'],
  authors: [{ name: 'Francis Mwaniki' }],
  creator: 'Francis Mwaniki',
  publisher: 'Auto Invoice API',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://auto-invoice-api.netlify.app',
    title: 'Auto Invoice API',
    description: 'Streamline your invoicing process with our powerful API and dashboard.',
    siteName: 'Auto Invoice API',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Auto Invoice API',
    description: 'Streamline your invoicing process with our powerful API and dashboard.',
    creator: '@FRANCIS90776084',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className={`${quicksand.className} flex flex-col min-h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800`}>
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              <div className="mr-4 hidden md:flex">
                <Link className="mr-6 flex items-center space-x-2" href="/dashboard">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                  </svg>
                  <span className="hidden font-bold sm:inline-block">
                    Dashboard
                  </span>
                </Link>
                <nav className="flex items-center space-x-6 text-sm font-medium">
                  <a
                    className="transition-colors hover:text-foreground/80 text-foreground/60"
                    href="/playground"
                  >
                    Documentation
                  </a>
                  <a
                    className="transition-colors hover:text-foreground/80 text-foreground/60"
                    href="/support"
                  >
                    Support
                  </a>
                </nav>
              </div>
              <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                <div className="w-full flex-1 md:w-auto md:flex-none">
                  <button className="inline-flex items-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64">
                    <span className="hidden lg:inline-flex">Search documentation...</span>
                    <span className="inline-flex lg:hidden">Search...</span>
                    <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                      <span className="text-xs">⌘</span>K
                    </kbd>
                  </button>
                </div>
                <nav className="flex items-center">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
                        Sign In
                      </button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                  </SignedIn>
                </nav>
              </div>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t flex justify-center items-center mx-auto">
            <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
              <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                  Built by{" "}
                  <a
                    href="https://github.com/Francis-Mwaniki"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium underline underline-offset-4"
                  >
                    Francis Mwaniki
                  </a>
                  . The source code is available on{" "}
                  <a
                    href="https://github.com/Francis-Mwaniki/auto-invoice-api"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium underline underline-offset-4"
                  >
                    GitHub
                  </a>
                  .
                </p>
              </div>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  )
}


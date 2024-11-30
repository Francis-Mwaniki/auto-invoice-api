"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, FileText, Zap, Lock, BarChart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="font-inter min-h-screen flex flex-col bg-gradient-to-b from-gray-100 to-white dark:from-gray-950 dark:to-gray-900">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur">
        <div className="container max-w-6xl mx-auto flex h-14 items-center px-4">
          <div className="mr-4 flex items-center">
            <Link className="flex items-center space-x-2" href="/">
              <FileText className="h-5 w-5 text-indigo-600" />
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                AutoInvoice
              </span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center space-x-2">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">Get Started</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="w-full py-12 md:py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="flex flex-col items-center space-y-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl"
              >
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
                  Streamline Invoice Generation with Our API
                </h1>
                <p className="mt-4 text-gray-600 dark:text-gray-300 text-base md:text-lg">
                  Effortlessly create professional, customizable invoices programmatically. Designed for businesses of all sizes.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col gap-2 min-[400px]:flex-row"
              >
                <Link href="/dashboard">
                  <Button size="lg" className="bg-indigo-600 text-white hover:bg-indigo-700">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/playground">
                  <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900">
                    Try Demo
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16 bg-gray-50 dark:bg-gray-900/50">
          <div className="container max-w-5xl mx-auto px-4">
            <h2 className="text-xl font-bold tracking-tight text-center mb-8 text-gray-900 dark:text-white sm:text-2xl">
              Key Features
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: Zap,
                  title: "Fast and Efficient",
                  description: "Generate invoices instantly with our high-performance API.",
                },
                {
                  icon: Lock,
                  title: "Secure and Reliable",
                  description: "Top-tier encryption and security protocols protect your data.",
                },
                {
                  icon: BarChart,
                  title: "Comprehensive Analytics",
                  description: "Gain deep insights with our advanced invoice tracking dashboard.",
                }
              ].map(({ icon: Icon, title, description }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                >
                  <Card className="h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <CardHeader>
                      <Icon className="h-5 w-5 mb-2 text-indigo-600" />
                      <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">{title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
                        {description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16">
          <div className="container max-w-3xl mx-auto px-4">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
                Ready to Transform Your Invoicing?
              </h2>
              <p className="max-w-[500px] text-gray-600 dark:text-gray-300 text-base md:text-lg">
                Join hundreds of businesses revolutionizing their invoicing workflow with our API.
              </p>
              <Link href="/sign-up">
                <Button size="lg" className="bg-indigo-600 text-white hover:bg-indigo-700">
                  Create Your Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-gray-100 dark:bg-gray-950/30">
        <div className="container max-w-6xl mx-auto flex flex-col items-center justify-between gap-4 py-6 md:h-20 md:flex-row md:py-0 px-4">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 md:text-left">
            © 2024 AutoInvoice. All rights reserved.
          </p>
          <nav className="flex items-center space-x-4 text-sm">
            <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
import { Metadata } from 'next'
import { SupportClient } from './client'

export const metadata: Metadata = {
  title: 'Support | Invoice Generator',
  description: 'Get help and find answers to frequently asked questions about our Invoice Generator.',
}

export default function SupportPage() {
  return <SupportClient />
}


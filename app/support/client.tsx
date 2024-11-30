"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search } from 'lucide-react'

const faqs = [
  {
    question: "What is the Invoice Generator?",
    answer: "The Invoice Generator is a powerful tool that allows you to create professional invoices quickly and easily. It integrates with our dashboard, allowing you to manage your invoices and API keys efficiently."
  },
  {
    question: "How do I generate an API key?",
    answer: "To generate an API key, log in to your dashboard and navigate to the 'API Keys' section. Click on the 'Generate' button, enter a name for your key, and it will be created instantly. Remember to keep your API keys secure and never share them publicly."
  },
  {
    question: "Can I customize the invoice template?",
    answer: "Currently, we offer a standard invoice template that works well for most businesses. We're working on adding customization options in a future update. Stay tuned for announcements about new features!"
  },
  {
    question: "How do I view my generated invoices?",
    answer: "You can view your recently generated invoices in the 'Recent Invoices' section of your dashboard. For a full history of all invoices, we're developing an 'Invoice History' page that will be available soon."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take data security very seriously. All data is encrypted in transit and at rest. We use industry-standard security practices to ensure your information is protected. For more details, please refer to our Privacy Policy."
  },
  {
    question: "How do I integrate the Invoice Generator with my application?",
    answer: "You can integrate our Invoice Generator using our RESTful API. First, generate an API key from your dashboard. Then, make POST requests to our API endpoint with your invoice data. Detailed API documentation is available in our Developer Guide."
  },
  {
    question: "What payment methods are supported for the invoices?",
    answer: "Our generated invoices support various payment methods including bank transfers, credit cards, and PayPal. You can specify the preferred payment method when generating an invoice through our API."
  },
  {
    question: "How often are new features added?",
    answer: "We're constantly working on improving our service and adding new features. We typically release updates on a monthly basis. Keep an eye on our blog and newsletter for announcements about new features and improvements."
  }
]

export function SupportClient() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-12"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Support Center</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Find answers to frequently asked questions and get help with our Invoice Generator.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search FAQs..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {filteredFaqs.length === 0 && (
            <p className="text-center text-muted-foreground mt-4">
              No matching questions found. Please try a different search term.
            </p>
          )}
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Still need help?</CardTitle>
            <CardDescription>Send us a message and we&apos;ll get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="Your email" type="email" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="How can we help you?" />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Send message</Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}


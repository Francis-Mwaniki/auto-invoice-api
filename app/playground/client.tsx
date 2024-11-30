"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Play } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { PDFModal } from "../../components/PDFModal"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ClipLoader } from "react-spinners"

interface BillTo {
  name: string
  address: string
}

interface InvoiceItem {
  name: string
  unitPrice: number
  units: number
}

interface InvoiceData {
  billTo: BillTo
  items: InvoiceItem[]
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
}

interface ApiKey {
  id: string
  key: string
  name: string
}

const BASE_URL = process.env.NEXT_PUBLIC_URL || 'https://auto-invoice-api.netlify.app'

export function PlaygroundClient({ apiKeys }: { apiKeys: ApiKey[] }) {
  const [loading, setLoading] = useState(false)
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    billTo: {
      name: "Vehement Capital Partners",
      address: "895 Sugarfoot Lane, Indiana 46225"
    },
    items: [
      {
        name: "More Time: How to focus on what matters",
        unitPrice: 200.00,
        units: 1
      },
      {
        name: "Grit: The Power of Passion and Perseverance",
        unitPrice: 200.00,
        units: 3
      }
    ],
    invoiceNumber: "213223444",
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  })

  const [selectedApiKey, setSelectedApiKey] = useState(apiKeys[0]?.key || "")
  const [result, setResult] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [generatedInvoiceNumber, setGeneratedInvoiceNumber] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
//   const iframeRef = useRef<HTMLIFrameElement>(null)

  const generateInvoice = async () => {
    setLoading(true)
    setGeneratedInvoiceNumber(null)
    try {
      const response = await fetch(`${BASE_URL}/api/generate-invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': selectedApiKey
        },
        body: JSON.stringify(invoiceData)
      })

      const data = await response.json()
      if (data.status === 200) {
        setResult(data.pdf)
        setGeneratedInvoiceNumber(data.invoiceNumber)
        toast({
          title: "Success",
          description: `Invoice generated successfully with number: ${data.invoiceNumber}`,
        })
        setShowModal(true)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error generating invoice:', error)
      toast({
        title: "Error",
        description: "Failed to generate invoice. Please check your API key and try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = () => {
    if (!result) return
    
    const linkSource = `data:application/pdf;base64,${result}`
    const downloadLink = document.createElement("a")
    const fileName = `invoice-${generatedInvoiceNumber || invoiceData.invoiceNumber}.pdf`

    downloadLink.href = linkSource
    downloadLink.download = fileName
    downloadLink.click()
  }

//   const reloadPDF = () => {
//     if (iframeRef.current && result) {
//       const iframe = iframeRef.current
//       iframe.src = `data:application/pdf;base64,${result}`
//     }
//   }

  const apiRequestCode = `
const response = await fetch('${BASE_URL}/api/generate-invoice', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': '${selectedApiKey}'
  },
  body: JSON.stringify(${JSON.stringify(invoiceData, null, 2)})
})

const data = await response.json()
if (data.status === 200) {
  console.log('Invoice generated successfully:', data.invoiceNumber)
  // Handle the generated PDF (data.pdf)
} else {
  console.error('Error:', data.message)
}
`

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6 sm:py-12 px-2 sm:px-4 lg:px-8">
  <div className="max-w-7xl mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden"
    >
      <div className="p-4 sm:p-6 lg:p-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 sm:mb-6 lg:mb-8 text-center">API Playground</h1>
        <div className="grid gap-6 lg:gap-12 grid-cols-1 lg:grid-cols-2">
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-5 rounded-lg shadow-inner">
              <Label htmlFor="api-key" className="text-base sm:text-lg font-semibold mb-2 block">API Key</Label>
              <Select value={selectedApiKey} onValueChange={setSelectedApiKey}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select API Key" />
                </SelectTrigger>
                <SelectContent>
                  {apiKeys.map((key) => (
                    <SelectItem key={key.id} value={key.key}>
                      {key.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <Label className="text-base sm:text-lg font-semibold">Bill To</Label>
              <Input
                value={invoiceData.billTo.name}
                onChange={(e) => setInvoiceData({
                  ...invoiceData,
                  billTo: { ...invoiceData.billTo, name: e.target.value }
                })}
                placeholder="Customer name"
                className="w-full text-sm sm:text-base"
              />
              <Textarea
                value={invoiceData.billTo.address}
                onChange={(e) => setInvoiceData({
                  ...invoiceData,
                  billTo: { ...invoiceData.billTo, address: e.target.value }
                })}
                placeholder="Customer address"
                className="w-full text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2 sm:space-y-3">
              <Label className="text-base sm:text-lg font-semibold">Invoice Details</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <Input
                  value={invoiceData.invoiceNumber}
                  onChange={(e) => setInvoiceData({
                    ...invoiceData,
                    invoiceNumber: e.target.value
                  })}
                  placeholder="Invoice number"
                  className="text-sm sm:text-base"
                />
                <Input
                  type="date"
                  value={invoiceData.invoiceDate}
                  onChange={(e) => setInvoiceData({
                    ...invoiceData,
                    invoiceDate: e.target.value
                  })}
                  className="text-sm sm:text-base"
                />
                <Input
                  type="date"
                  value={invoiceData.dueDate}
                  onChange={(e) => setInvoiceData({
                    ...invoiceData,
                    dueDate: e.target.value
                  })}
                  className="text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <Label className="text-base sm:text-lg font-semibold">Items</Label>
              <div className="space-y-2 sm:space-y-4">
                {invoiceData.items.map((item, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
                    <Input
                      value={item.name}
                      onChange={(e) => {
                        const newItems = [...invoiceData.items]
                        newItems[index].name = e.target.value
                        setInvoiceData({ ...invoiceData, items: newItems })
                      }}
                      placeholder="Item name"
                      className="mb-2 w-full text-sm sm:text-base"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => {
                          const newItems = [...invoiceData.items]
                          newItems[index].unitPrice = parseFloat(e.target.value)
                          setInvoiceData({ ...invoiceData, items: newItems })
                        }}
                        placeholder="Unit price"
                        className="text-sm sm:text-base"
                      />
                      <Input
                        type="number"
                        value={item.units}
                        onChange={(e) => {
                          const newItems = [...invoiceData.items]
                          newItems[index].units = parseInt(e.target.value)
                          setInvoiceData({ ...invoiceData, items: newItems })
                        }}
                        placeholder="Units"
                        className="text-sm sm:text-base"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button onClick={generateInvoice} disabled={loading} className="w-full sm:w-auto text-sm sm:text-base">
                {loading ? (
                  <ClipLoader color="orange" size={20} />
                ) : (
                  <>
                    <Play className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Generate Invoice
                  </>
                )}
              </Button>
              {result && (
                <Button onClick={downloadPDF} variant="outline" className="w-full sm:w-auto text-sm sm:text-base">
                  <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Download PDF
                </Button>
              )}
            </div>

            {generatedInvoiceNumber && (
              <div className="mt-2 sm:mt-4 p-2 sm:p-4 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-md">
                <p className="text-xs sm:text-sm text-green-800 dark:text-green-200">Generated Invoice Number: {generatedInvoiceNumber}</p>
              </div>
            )}
          </div>
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview" className="text-xs sm:text-sm">Preview</TabsTrigger>
                <TabsTrigger value="request" className="text-xs sm:text-sm">API Request</TabsTrigger>
              </TabsList>
              <TabsContent value="preview">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 sm:p-6 shadow-inner">
                  <Label className="text-base sm:text-lg font-semibold mb-2 block">Preview</Label>
                 <SyntaxHighlighter language="json" style={tomorrow} customStyle={{
                    backgroundColor: 'transparent',
                    padding: '0',
                    margin: '0',
                    fontSize: '0.675rem sm:text-xs',
                    fontWeight: 700,
                  }}>
                    {JSON.stringify(invoiceData, null, 2)}
                  </SyntaxHighlighter>
                </div>
              </TabsContent>
              <TabsContent value="request">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 sm:p-6 shadow-inner">
                  <Label className="text-base sm:text-lg font-semibold mb-2 block">API Request</Label>
                  <SyntaxHighlighter language="javascript" style={tomorrow} customStyle={{
                    backgroundColor: 'transparent',
                    padding: '0',
                    margin: '0',
                    fontSize: '0.675rem sm:text-xs',
                    fontWeight: 700,
                  }}>
                    {apiRequestCode}
                  </SyntaxHighlighter>
                </div>
              </TabsContent>
            </Tabs>

                {result && (
                 <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 sm:p-6 shadow-inner">
                    <div className="flex items-center justify-between mb-2 sm:mb-4">
                      <Label className="text-lg font-semibold">PDF Preview</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowModal(true)}
                      >
                        Open PDF
                      </Button>
                    </div>
                    <iframe ref={iframeRef} title="Invoice Preview" width="100%" height="500px" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <PDFModal isOpen={showModal} onClose={() => setShowModal(false)} pdfData={result || ""} />
    </div>
  )
}


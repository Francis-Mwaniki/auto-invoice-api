"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'

interface PDFModalProps {
  isOpen: boolean
  onClose: () => void
  pdfData: string
}

export function PDFModal({ isOpen, onClose, pdfData }: PDFModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl"
          >
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold">PDF Preview</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="p-4">
              <iframe
                src={`data:application/pdf;base64,${pdfData}`}
                className="w-full h-[70vh] border-0 rounded-lg"
                title="Invoice PDF Preview"
              />
            </div>
            <div className="flex justify-end p-4 border-t dark:border-gray-700">
              <Button variant="outline" onClick={onClose}>Close</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


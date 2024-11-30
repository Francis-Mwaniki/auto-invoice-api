/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { jsPDF as JsPDFCustom } from 'jspdf';
import { UserOptions } from 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => void;
  }
}

interface BillTo {
  name: string;
  address: string;
}

interface InvoiceItem {
  name: string;
  unitPrice: number;
  units: number;
}

interface InvoiceData {
  billTo: BillTo;
  items: InvoiceItem[];
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
}

export async function generateInvoicePDF(data: InvoiceData): Promise<string> {
  // Create new PDF document
  const doc = new jsPDF() as JsPDFCustom;
  
  // Set default font
  doc.setFont('helvetica', 'normal');
  
  // Define colors
  const primaryColor: [number, number, number] = [52, 152, 219]; // RGB for #3498db
  const secondaryColor: [number, number, number] = [44, 62, 80]; // RGB for #2c3e50
  const lightGray: [number, number, number] = [236, 240, 241]; // RGB for #ecf0f1
  const bgColor: [number, number, number] = [250, 250, 250]; // Light background color
  
  // Add background color
  doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
  doc.rect(0, 0, 210, 297, 'F');
  
  // Add company logo and header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 105, 25, { align: 'center' });
  
  // Add invoice details
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const leftColumnX = 15;
  const rightColumnX = 140;
  let currentY = 50;
  
  // Left column
  doc.text('Bill To:', leftColumnX, currentY);
  currentY += 7;
  doc.setFont('helvetica', 'bold');
  doc.text(data.billTo.name, leftColumnX, currentY);
  currentY += 5;
  doc.setFont('helvetica', 'normal');
  const addressLines = doc.splitTextToSize(data.billTo.address, 80);
  addressLines.forEach((line: string) => {
    doc.text(line, leftColumnX, currentY);
    currentY += 5;
  });
  
  // Right column
  currentY = 50;
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Details', rightColumnX, currentY);
  currentY += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice Number: ${data.invoiceNumber}`, rightColumnX, currentY);
  currentY += 5;
  doc.text(`Invoice Date: ${data.invoiceDate}`, rightColumnX, currentY);
  currentY += 5;
  doc.text(`Due Date: ${data.dueDate}`, rightColumnX, currentY);
  
  // Add items table
  const tableColumns = [
    { header: 'Item', dataKey: 'name' },
    { header: 'Unit Price', dataKey: 'unitPrice' },
    { header: 'Quantity', dataKey: 'units' },
    { header: 'Total', dataKey: 'total' }
  ];
  
//   const tableRows = data.items.map(item => ({
//     name: item.name,
//     unitPrice: `$${item.unitPrice.toFixed(2)}`,
//     units: item.units,
//     total: `$${(item.unitPrice * item.units).toFixed(2)}`
//   }));
  
  // Calculate total
  const total = data.items.reduce((sum, item) => sum + (item.unitPrice * item.units), 0);
  
  // Add table
  doc.autoTable({
    startY: currentY + 15,
    head: [tableColumns.map(col => col.header)],
    // body: tableRows,
    body: data.items.map(item => [
        item.name,
        `$${item.unitPrice.toFixed(2)}`,
        item.units,
        `$${(item.unitPrice * item.units).toFixed(2)}`
      ]),
      foot: [[
        { 
          content: 'Total:', 
          colSpan: 3, 
          styles: { 
            halign: 'right', 
            fillColor: lightGray, 
            fontStyle: 'bold',
            textColor: [0, 0, 0]  // Adding black text color
          } 
        },
        { 
          content: `$${total.toFixed(2)}`, 
          styles: { 
            halign: 'right', 
            fillColor: lightGray, 
            fontStyle: 'bold',
            textColor: [0, 0, 0]  // Adding black text color
          } 
        }
      ]],
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      //black rgb(0,0,0)
      textColor: [0, 0, 0],
      fontSize: 12,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 10,
      lineColor: [189, 195, 199],
      lineWidth: 0.5
    },
    alternateRowStyles: {
      fillColor: [240, 245, 250]  // Slightly darker alternate row color
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 40, halign: 'right' },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 40, halign: 'right' }
    },
    margin: { top: 15, right: 15, bottom: 15, left: 15 },
    didDrawPage: (data) => {
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(
        `Page ${data.pageNumber} of ${doc.internal.pages.length - 1}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
  });
  
  // Add a thank you note
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  doc.setFontSize(10);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('Thank you for your business!', 105, finalY + 15, { align: 'center' });
  
  // Return only the base64 string without the data URI prefix
  const dataUri = doc.output('datauristring');
  return dataUri.split(',')[1];
}

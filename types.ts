export interface BillTo {
    name: string;
    address: string;
  }
  
  export interface InvoiceItem {
    name: string;
    unitPrice: number;
    units: number;
  }
  
  export interface InvoiceData {
    billTo: BillTo;
    items: InvoiceItem[];
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
  }
  
  
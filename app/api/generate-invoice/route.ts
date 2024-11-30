/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateInvoicePDF } from "@/lib/pdf";
 

export const dynamic = "force-dynamic";

// Interfaces for type safety
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

// Helper function to validate date strings
function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

// Comprehensive type guard function for invoice data
function validateInvoiceData(data: any): data is InvoiceData {
  if (!data) return false;
  if (typeof data !== 'object' || data === null) return false;

  // Check billTo
  if (!data.billTo || typeof data.billTo !== 'object') {
    console.error("Invalid billTo: ", data.billTo);
    return false;
  }
  if (typeof data.billTo.name !== 'string' || data.billTo.name.trim() === '') {
    console.error("Invalid billTo name: ", data.billTo.name);
    return false;
  }
  if (typeof data.billTo.address !== 'string' || data.billTo.address.trim() === '') {
    console.error("Invalid billTo address: ", data.billTo.address);
    return false;
  }

  // Check items
  if (!Array.isArray(data.items) || data.items.length === 0) {
    console.error("Invalid or empty items: ", data.items);
    return false;
  }
  
  // Validate each item
  for (const item of data.items) {
    if (typeof item !== 'object' || item === null) {
      console.error("Invalid item object: ", item);
      return false;
    }
    if (typeof item.name !== 'string' || item.name.trim() === '') {
      console.error("Invalid item name: ", item.name);
      return false;
    }
    if (typeof item.unitPrice !== 'number' || item.unitPrice < 0) {
      console.error("Invalid unit price: ", item.unitPrice);
      return false;
    }
    if (typeof item.units !== 'number' || item.units < 0) {
      console.error("Invalid units: ", item.units);
      return false;
    }
  }

  // Check invoice metadata
  if (typeof data.invoiceNumber !== 'string' || data.invoiceNumber.trim() === '') {
    console.error("Invalid invoice number: ", data.invoiceNumber);
    return false;
  }
  if (typeof data.invoiceDate !== 'string' || !isValidDate(data.invoiceDate)) {
    console.error("Invalid invoice date: ", data.invoiceDate);
    return false;
  }
  if (typeof data.dueDate !== 'string' || !isValidDate(data.dueDate)) {
    console.error("Invalid due date: ", data.dueDate);
    return false;
  }

  return true;
}

// Function to generate a unique invoice number
async function generateUniqueInvoiceNumber(baseNumber: string): Promise<string> {
  let invoiceNumber = baseNumber;
  let suffix = 1;
  let isUnique = false;

  while (!isUnique) {
    const existingInvoice = await prisma.invoice.findUnique({
      where: { invoiceNumber }
    });

    if (!existingInvoice) {
      isUnique = true;
    } else {
      suffix++;
      invoiceNumber = `${baseNumber}-${suffix}`;
    }
  }

  return invoiceNumber;
}

// Main POST handler for invoice generation
export async function POST(req: Request) {
  // Initialize variables to help with debugging
  let apiKey = null;
  let user = null;
  let rawData = null;
  let data: InvoiceData | null = null;

  try {
    // Validate API key
    apiKey = req.headers.get("x-api-key");
    console.log("API Key received:", apiKey);
    
    if (!apiKey) {
      console.error("No API key provided");
      return NextResponse.json({ error: "API key is required" }, { status: 401 });
    }

    // Authenticate user with API key
    user = await prisma.user.findFirst({
      where: {
        apiKeys: {
          some: {
            key: apiKey,
            isActive: true,
          },
        },
      },
    });

    console.log("User found:", user ? user.id : "No user found");

    if (!user) {
      console.error("No user found for the given API key");
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Check Content-Type header
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Invalid content type:", contentType);
      return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 415 });
    }

    // Parse and validate request body
    try {
      // Add a check for empty body
      const text = await req.text();
      console.log("Raw request body:", text);

      if (!text.trim()) {
        console.error("Empty request body");
        return NextResponse.json({ error: "Request body cannot be empty" }, { status: 400 });
      }

      rawData = JSON.parse(text);
      console.log("Parsed raw data:", JSON.stringify(rawData, null, 2));
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      return NextResponse.json({ 
        error: "Invalid JSON in request body", 
        details: parseError instanceof Error ? parseError.message : String(parseError)
      }, { status: 400 });
    }

    // Additional validation checks
    if (!rawData || typeof rawData !== 'object') {
      console.error("Request body is not an object:", rawData);
      return NextResponse.json({ error: "Request body must be a non-null object" }, { status: 400 });
    }

    // Validate invoice data
    if (!validateInvoiceData(rawData)) {
      console.error("Data validation failed", rawData);
      return NextResponse.json({ 
        error: "Invalid input data",
        details: "Ensure all required fields are present and of correct type"
      }, { status: 400 });
    }

    // Type assertion after validation
    data = rawData as InvoiceData;

    // Calculate totals with detailed logging
    console.log("Calculating invoice total");
    const total = data.items.reduce((sum, item) => {
      const itemTotal = item.unitPrice * item.units;
      console.log(`Item: ${item.name}, Unit Price: ${item.unitPrice}, Units: ${item.units}, Item Total: ${itemTotal}`);
      return sum + itemTotal;
    }, 0);
    console.log("Total calculated:", total);

    // Generate a unique invoice number
    const uniqueInvoiceNumber = await generateUniqueInvoiceNumber(data.invoiceNumber);
    console.log("Generated unique invoice number:", uniqueInvoiceNumber);

    // Update the invoice data with the new unique number
    data.invoiceNumber = uniqueInvoiceNumber;

    // Generate PDF
    console.log("Generating invoice PDF");
    const pdfBase64 = await generateInvoicePDF(data);
    console.log("PDF generated successfully");

    // Save to database
    console.log("Attempting to save invoice to database");
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: uniqueInvoiceNumber,
        amount: total,
        customerName: data.billTo.name,
        status: 'GENERATED',
        pdfUrl: pdfBase64,
        userId: user.id
      }
    });
    console.log("Invoice saved successfully:", invoice.id);

    return NextResponse.json({
      message: "Invoice generated successfully",
      status: 200,
      invoiceId: invoice.id,
      invoiceNumber: uniqueInvoiceNumber,
      pdf: pdfBase64
    });

  } catch (error) {
    // Log full error details for debugging
    console.error("Unexpected invoice generation error:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      apiKey,
      user: user ? user.id : null,
      rawData,
      data
    });

    return NextResponse.json({
      message: "An unexpected error occurred during invoice generation",
      status: 500,
      error: error instanceof Error ? error.message : String(error),
      details: {
        apiKeyProvided: !!apiKey,
        userFound: !!user,
        rawDataParsed: !!rawData,
        dataValidated: !!data
      }
    }, { status: 500 });
  }
}

// Optional GET handler for retrieving invoices
export async function GET(req: Request) {
  try {
    // Validate API key
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 401 });
    }

    // Authenticate user with API key
    const user = await prisma.user.findFirst({
      where: {
        apiKeys: {
          some: {
            key: apiKey,
            isActive: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Parse URL to get potential query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const status = searchParams.get('status') || undefined;

    // Fetch invoices with pagination and optional status filter
    const invoices = await prisma.invoice.findMany({
      where: {
        userId: user.id,
        ...(status && { status }),
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        invoiceNumber: true,
        customerName: true,
        amount: true,
        status: true,
        createdAt: true
      }
    });

    // Count total invoices for pagination
    const totalInvoices = await prisma.invoice.count({
      where: {
        userId: user.id,
        ...(status && { status }),
      }
    });

    return NextResponse.json({
      invoices,
      pagination: {
        page,
        limit,
        total: totalInvoices,
        totalPages: Math.ceil(totalInvoices / limit)
      }
    });
  } catch (error) {
    console.error("Invoice retrieval error:", error);
    return NextResponse.json({
      message: "An unexpected error occurred",
      status: 500,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}


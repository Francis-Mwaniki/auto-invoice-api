import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const { apiKey } = await req.json()
    
    const key = await prisma.apiKey.findUnique({
      where: {
        key: apiKey,
        isActive: true,
      },
    })

    return NextResponse.json({
      valid: !!key,
      status: 200,
    })
  } catch (error: unknown) {
    console.error("API key verification error:", error)
    return NextResponse.json({
      message: "An error occurred",
      status: 500,
    })
  }
}


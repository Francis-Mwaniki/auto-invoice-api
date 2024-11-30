import { auth } from '@clerk/nextjs/server'
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  const { userId } =await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  try {
    const apiKey = await prisma.apiKey.create({
      data: {
        name,
        key: `pk_${crypto.randomBytes(24).toString("hex")}`,
        userId: userId,
      },
    });

    return NextResponse.json(apiKey);
  } catch (error) {
    console.error("Error generating API key:", error);
    return NextResponse.json(
      { error: "Failed to generate API key" },
      { status: 500 }
    );
  }
}


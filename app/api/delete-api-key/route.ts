
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from '@clerk/nextjs/server'
export async function DELETE(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "API key ID is required" }, { status: 400 });
  }

  try {
    const apiKey = await prisma.apiKey.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!apiKey || apiKey.userId !== userId) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    await prisma.apiKey.delete({
      where: { id },
    });

    return NextResponse.json({ message: "API key deleted successfully" });
  } catch (error) {
    console.error("Error deleting API key:", error);
    return NextResponse.json(
      { error: "Failed to delete API key" },
      { status: 500 }
    );
  }
}


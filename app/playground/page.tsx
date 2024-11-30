import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from "next/navigation";
import { PlaygroundClient } from "./client";
import prisma from "@/lib/prisma";

export default async function PlaygroundPage() {
    const { userId, redirectToSignIn } = await auth()

    if (!userId) return redirectToSignIn()


     await currentUser();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { apiKeys: true },
  });

  if (!user || user.apiKeys.length === 0) {
    redirect("/dashboard");
  }

  return <PlaygroundClient apiKeys={user.apiKeys} />;
}


import { currentUser } from '@clerk/nextjs/server'
import { auth } from '@clerk/nextjs/server'
import { redirect } from "next/navigation";
import { DashboardClient } from "./client";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
    const { userId, redirectToSignIn } = await auth()

    if (!userId) return redirectToSignIn()


  const user = await currentUser();
  
  if (!userId || !user) {
    redirect("/sign-in");
  }

  const dbUser = await prisma.user.upsert({
    where: { id: userId },
    update: { email: user.emailAddresses[0].emailAddress },
    create: {
      id: userId,
      email: user.emailAddresses[0].emailAddress,
    },
    include: { apiKeys: true },
  });

  const invoices = await prisma.invoice.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return <DashboardClient user={dbUser} invoices={invoices} />;
}


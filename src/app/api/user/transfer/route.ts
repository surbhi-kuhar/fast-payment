import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth";
import {prisma} from "@/lib/client";


export const POST = async (req: Request) => {
  const { amount, to } = await req.json();

  // Get the user session
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const fromUserId = session.user.id;

  // Don't allow transfer to oneself
  if (to === fromUserId) {
    return NextResponse.json({ message: "Cannot transfer to yourself!" }, { status: 400 });
  }

  try {
    // Begin the transaction
    await prisma.$transaction(async (prisma) => {
      const fromUserBalance = await prisma.balance.findUnique({
        where: { userId: fromUserId },
      });

      if (!fromUserBalance || fromUserBalance.amount < amount) {
        throw new Error("Insufficient balance");
      }

      const toUserBalance = await prisma.balance.findUnique({
        where: { userId: to },
      });

      if (!toUserBalance) {
        throw new Error("Invalid recipient account");
      }

      // Update sender's balance
      await prisma.balance.update({
        where: { userId: fromUserId },
        data: { amount: { decrement: amount } },
      });

      // Update recipient's balance
      await prisma.balance.update({
        where: { userId: to },
        data: { amount: { increment: amount } },
      });

      // Record the transfer in p2pTransfer table
      await prisma.p2pTransfer.create({
        data: {
          amount,
          fromUserId,
          toUserId: to,
          timestamp: new Date(),
        },
      });
    });

    return NextResponse.json({ message: "Transfer successful" });
  } catch (error: any) {
    console.error("Transfer error:", error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

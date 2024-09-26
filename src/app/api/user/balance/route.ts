import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import {prisma} from "@/lib/client";

export const GET = async () => {
  // Get the user session
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  // Fetch balance from the Prisma database
  const balance = await prisma.balance.findUnique({
    where: {
      userId: parseInt(session.user.id), // Assuming `session.user.id` holds the userId
    },
  });

  // If no balance record found
  if (!balance) {
    return NextResponse.json({ message: "Balance not found" }, { status: 404 });
  }

  // Return the balance
  return NextResponse.json({ balance: balance.amount });
};

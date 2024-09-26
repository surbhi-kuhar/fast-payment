import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import type { NextApiRequest, NextApiResponse } from 'next';
import { p2pTransfer } from "../../../lib/actions/p2pTransfer";
import {prisma} from "@/lib/client";


type Data = {
  success?: boolean;
  message: string;
};
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


export const POST = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method === 'POST') {
    const { to, amount } = req.body;

    try {
      // Call p2pTransfer with the parameters received
      const result = await p2pTransfer(to, amount);

      // Return the result of the transfer
      return res.json({ success: true, message: result.message });
    } catch (error) {
      // Return error message if something goes wrong
      return res.json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    // Handle unsupported methods
    return res.json({ success: false, message: 'Method Not Allowed' });
  }
};

export default POST;
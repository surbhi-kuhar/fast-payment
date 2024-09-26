// pages/api/p2pTransfer.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { p2pTransfer } from '../lib/actions/p2pTransfer';

type Data = {
  success?: boolean;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    const { to, amount } = req.body;

    try {
      // Assuming p2pTransfer returns { success: boolean, message: string }
      const result = await p2pTransfer(to, amount);

      // Return the result of the transfer
      return res.status(200).json({ success: true,message:"done"});
    } catch (error) {
      // Return error message if something goes wrong
      return res.status(500).json({success: false, message: 'Internal Server Error' });
    }
  } else {
    // Handle unsupported methods
    return res.status(405).json({ success:false, message: 'Method Not Allowed' });
  }
}

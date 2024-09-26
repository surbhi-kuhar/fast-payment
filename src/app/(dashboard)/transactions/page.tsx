import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { OnRampTransactionn } from "@/components/OnRampTransactionn";
import { PeerToPeer } from "@/components/PeerToPeer";
import {prisma} from "@/lib/client";
async function getOnRampTransactions() {
    const session = await getServerSession(authOptions);
    const txns = await prisma.onRampTransaction.findMany({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return txns.map(t => ({
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }))
}
async function getOnPeerTransactions() {
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);

    if (!userId) {
        throw new Error('User is not authenticated');
    }

    const transfers = await prisma.p2pTransfer.findMany({
        include: {
          fromUser: {
            select: {
              id: true,
              name: true,
              email: true,
              number: true,
            },
          },
          toUser: {
            select: {
              id: true,
              name: true,
              email: true,
              number: true,
            },
          },
        },
        where: {
            OR: [
                { fromUserId: userId },
            ],
        },
        orderBy: {
          timestamp: 'desc',  // Orders by the latest transaction first
        },
    });

    // Map over the transfers and return relevant details
    const data=  transfers.map(t => ({
        time: t.timestamp,
        amount: t.amount,
        fromUser: t.fromUser,
        toUser: t.toUser
    }));
    console.log("data",data);
    return data;
}
async function getOnPeerTransactions1() {
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);

    if (!userId) {
        throw new Error('User is not authenticated');
    }

    const transfers = await prisma.p2pTransfer.findMany({
        include: {
          fromUser: {
            select: {
              id: true,
              name: true,
              email: true,
              number: true,
            },
          },
          toUser: {
            select: {
              id: true,
              name: true,
              email: true,
              number: true,
            },
          },
        },
        where: {
            OR: [
                {toUserId: userId },
            ],
        },
        orderBy: {
          timestamp: 'desc',  // Orders by the latest transaction first
        },
    });

    // Map over the transfers and return relevant details
    const data=  transfers.map(t => ({
        time: t.timestamp,
        amount: t.amount,
        fromUser: t.fromUser,
        toUser: t.toUser
    }));
    console.log("data",data);
    return data;
}
export default async function() {
    const transactions = await getOnRampTransactions();
    const peertranscations=await getOnPeerTransactions();
    const peertranscations1 =await getOnPeerTransactions1();
    return <div>
        <OnRampTransactionn transactions={transactions} />
        <PeerToPeer transactions={peertranscations} text={"Send Money"}/>
        <PeerToPeer transactions={peertranscations1} text={"Received Money"}/>
    </div>
}
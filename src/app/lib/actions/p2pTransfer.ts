"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import {prisma} from "@/lib/client";


export async function p2pTransfer(to: string, amount: number) {
    console.log("Initiating P2P transfer");
    
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;
    if (!from) {
        console.log("No user session found for P2P transfer");
        return {
            message: "Error while sending"
        };
    }
    
    // Find the receiving user
    const toUser = await prisma.user.findFirst({
        where: {
            number: to
        }
    });
    
    if (!toUser) {
        console.log("Recipient user not found for P2P transfer");
        return {
            message: "User not found"
        };
    }
    
    // Start transaction with locking mechanism
    try {
        await prisma.$transaction(async (tx) => {
            // Lock from user's balance for update to avoid race conditions
            await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;
            console.log("From user balance locked for update");

            // Get the balance for the 'from' user
            const fromBalance = await tx.balance.findUnique({
                where: { userId: Number(from) },
            });
            
            if (!fromBalance || fromBalance.amount < amount) {
                throw new Error('Insufficient funds');
            }

            // Update the 'from' user's balance by decrementing the amount and increment the locked amount
            await tx.balance.update({
                where: { userId: Number(from) },
                data: {
                    amount: { decrement: amount },
                    locked: { increment: amount } // Lock the transferred amount
                },
            });

            // Get and lock the 'to' user's balance
            await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${toUser.id} FOR UPDATE`;
            console.log("To user balance locked for update");

            // Update the 'to' user's balance
            await tx.balance.update({
                where: { userId: toUser.id },
                data: { amount: { increment: amount } },
            });

            // Create the P2P transfer record
            await tx.p2pTransfer.create({
                data: {
                    fromUserId: Number(from),
                    toUserId: toUser.id,
                    amount,
                    timestamp: new Date(),
                },
            });

            // Release the locked amount from 'from' user's locked balance
            await tx.balance.update({
                where: { userId: Number(from) },
                data: { locked: { decrement: amount } },
            });

            console.log("P2P transfer completed successfully");
        });
        
        return {
            message: "Transfer successful",
            success:true
        };
    } catch (error) {
        console.error("Error during P2P transfer:", error);
        return {
            message: "Transfer failed"
        };
    }
}

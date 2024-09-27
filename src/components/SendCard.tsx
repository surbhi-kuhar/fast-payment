// SendCard.tsx
"use client"; 
import { Button } from "@/ui/src/button";
import { Card } from "@/ui/src/card";
import { Center } from "@/ui/src/Center";
import { TextInput } from "@/ui/src/TextInput";
import { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";
import { useRouter } from "next/navigation";
export function SendCard() {
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");
  const router=useRouter();
  const handleSend = async () => {
    try {
         await p2pTransfer(number,parseInt(amount));
        router.push("/dashboard");
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };
  return (
    <div className="h-[90vh]">
      <Center>
        <Card title="Send">
          <div className="min-w-72 pt-2 border-black">
            <TextInput
              placeholder={"Number"}
              label="Number"
              onChange={(value) => setNumber(value)}
            />
            <TextInput
              placeholder={"Amount"}
              label="Amount"
              onChange={(value) => setAmount(value)}
            />
            <div className="pt-4 flex justify-center">
              <Button onClick={handleSend}>Send</Button>
            </div>
          </div>
        </Card>
      </Center>
    </div>
  );
}

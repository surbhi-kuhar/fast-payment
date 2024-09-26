"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Balance } from "./Balance";
import { Users } from "./Users";
import { Loader } from "@/components/Loader";

const Dashboard = () => {
  const [bal, setBal] = useState(0);
  const router = useRouter();
  const { data: session, status } = useSession(); // Using NextAuth session
  const[loading,setLoading]=useState<boolean>(false);

  useEffect(() => {
    const fetchBalance = async () => {
      setLoading(true);
      if (status === "loading") {
        // Session is being fetched, return nothing
        setLoading(false);
        return;
      }
  
      if (status === "unauthenticated") {
        // If the user is not authenticated, redirect to sign in
        setLoading(false);
        signIn();
        return;
      }
  
      if (status === "authenticated" && session?.user) {
        try {
          // Fetch balance if user is authenticated
          const response = await axios.get("http://localhost:3000/api/user/balance");
          setBal(response.data.balance); // Set the balance
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error("Error fetching balance:", error);
          router.push("/api/auth/signin");
        }
      }
    };
  
    fetchBalance();
  }, [status, session, router]);
  

  if (status === "loading") {
    return <p>Loading...</p>; // While checking authentication
  }
  if(loading){
    return <Loader loading={loading}/>
  }
  return (
    <div>
      <div className="m-8">
        <Balance value={bal} />
        <Users />
      </div>
    </div>
  );
};

export default Dashboard;

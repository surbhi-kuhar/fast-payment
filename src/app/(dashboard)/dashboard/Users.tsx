"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./Button";
import axios from "axios";
import { CiUser } from "react-icons/ci";

export const Users = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const router = useRouter();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/user/bulk/?filter=${filter}`
        );
        setUsers(response.data.user);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
  };
  
    fetchUsers();
  }, [filter]);
  

  return (
    <>
      <div className="font-bold mt-6 text-lg">Users</div>
      <div className="mt-4 mb-10">
        <input
          onChange={(e) => setFilter(e.target.value)}
          type="text"
          placeholder="Search users..."
          className="w-full px-2 py-1 border rounded border-slate-200"
        />
      </div>
      <div>
        {users.map((user) => (
          <User key={user._id} user={user} />
        ))}
      </div>
    </>
  );
};

const User = ({ user }: { user: any }) => {
  const router = useRouter();

  return (
    <div className="flex justify-between">
      <div className="flex">
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
          <CiUser />
          </div>
        </div>
        <div className="flex flex-col justify-center h-full">
          <div>
            {user.name.charAt(0).toUpperCase() + user.name.slice(1)} {user.number}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center h-full">
        <Button
          onClick={() =>
            router.push("/p2p")
          }
          label="Send Money"
        />
      </div>
    </div>
  );
};

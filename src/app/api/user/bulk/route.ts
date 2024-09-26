import {prisma} from "@/lib/client";
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
   console.log("called may user"); 
  const url = new URL(request.url);
  const filter = url.searchParams.get('filter') || '';

  try {
    // Fetch users based on the filter
    const users = await prisma.user.findMany({
      where: {
        // Assuming you want to filter by name or email
        OR: [
          { name: { contains: filter, mode: 'insensitive' } }
        ],
      },
    });
    console.log(users);

    return NextResponse.json({ user: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET - Fetch current user's e-cards
export async function GET() {
  try {
    const session = await getServerSession(authOptions) as { user: { id: string } } | null;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);

    const ecards = await prisma.eCard.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        company: true,
      },
      orderBy: {
        id: 'desc'
      }
    });

    return NextResponse.json({ ecards });
  } catch (error) {
    console.error("Error fetching user's e-cards:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

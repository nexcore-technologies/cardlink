import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET - Fetch current user's e-card
export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);

    const ecard = await prisma.eCard.findUnique({
      where: {
        ownerId: userId,
      },
      include: {
        company: true,
      },
    });

    return NextResponse.json({ ecard });
  } catch (error) {
    console.error("Error fetching user's e-card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

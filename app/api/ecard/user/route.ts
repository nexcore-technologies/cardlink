import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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

// DELETE - Delete a specific e-card
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as { user: { id: string } } | null;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const ecardId = searchParams.get("id");

    if (!ecardId) {
      return NextResponse.json(
        { error: "E-card ID is required" },
        { status: 400 }
      );
    }

    const userId = parseInt(session.user.id);
    const ecardIdInt = parseInt(ecardId);

    // Check if the e-card belongs to the user
    const ecard = await prisma.eCard.findFirst({
      where: {
        id: ecardIdInt,
        ownerId: userId,
      },
    });

    if (!ecard) {
      return NextResponse.json(
        { error: "E-card not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete the e-card
    await prisma.eCard.delete({
      where: {
        id: ecardIdInt,
      },
    });

    return NextResponse.json({ message: "E-card deleted successfully" });
  } catch (error) {
    console.error("Error deleting e-card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

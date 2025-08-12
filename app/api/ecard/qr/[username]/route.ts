import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET - Fetch QR code for a specific e-card
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const ecard = await prisma.eCard.findUnique({
      where: {
        username: username,
      },
      select: {
        qrCodeUrl: true,
      },
    });

    if (!ecard || !ecard.qrCodeUrl) {
      return NextResponse.json(
        { error: "QR code not found" },
        { status: 404 }
      );
    }

    // Return the QR code data URL
    return NextResponse.json({ 
      qrCodeUrl: ecard.qrCodeUrl,
      username: username 
    });
  } catch (error) {
    console.error("Error fetching QR code:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

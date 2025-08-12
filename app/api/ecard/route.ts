import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";

// GET - Fetch e-card by username
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username parameter is required" },
        { status: 400 }
      );
    }

    const ecard = await prisma.eCard.findUnique({
      where: {
        username: username,
      },
      include: {
        company: true,
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!ecard) {
      return NextResponse.json(
        { error: "E-card not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ecard });
  } catch (error) {
    console.error("Error fetching e-card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create or update e-card
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { username, fullName, title, phone, email, linkedin, companyId } = await request.json();
    const userId = parseInt(session.user.id);

    // Validate required fields
    if (!username || !fullName) {
      return NextResponse.json(
        { error: "Username and full name are required" },
        { status: 400 }
      );
    }

    // Check if username is already taken by another user
    const existingEcard = await prisma.eCard.findUnique({
      where: {
        username: username,
      },
    });

    if (existingEcard && existingEcard.ownerId !== userId) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 }
      );
    }

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(`https://yourdomain.com/u/${username}`);

    let ecard;

    if (existingEcard && existingEcard.ownerId === userId) {
      // Update existing e-card
      ecard = await prisma.eCard.update({
        where: {
          id: existingEcard.id,
        },
        data: {
          username,
          fullName,
          title: title || null,
          phone: phone || null,
          email: email || null,
          linkedin: linkedin || null,
          companyId: companyId ? parseInt(companyId) : null,
          qrCodeUrl,
        },
        include: {
          company: true,
        },
      });
    } else {
      // Create new e-card
      ecard = await prisma.eCard.create({
        data: {
          username,
          fullName,
          title: title || null,
          phone: phone || null,
          email: email || null,
          linkedin: linkedin || null,
          companyId: companyId ? parseInt(companyId) : null,
          qrCodeUrl,
          ownerId: userId,
        },
        include: {
          company: true,
        },
      });
    }

    return NextResponse.json({
      message: existingEcard ? "E-card updated successfully" : "E-card created successfully",
      ecard,
    });
  } catch (error) {
    console.error("Error creating/updating e-card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

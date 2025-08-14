import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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

// POST - Create new e-card
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as { user: { id: string } } | null;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { username, fullName, title, phone, email, linkedin, profileImage, coverImage, companyId, newCompany } = await request.json();
    const userId = parseInt(session.user.id);

    // Validate required fields
    if (!username || !fullName) {
      return NextResponse.json(
        { error: "Username and full name are required" },
        { status: 400 }
      );
    }

    // Check if username is already taken
    const existingEcard = await prisma.eCard.findUnique({
      where: {
        username: username,
      },
    });

    if (existingEcard) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 }
      );
    }

    // Create company if needed
    let finalCompanyId = companyId ? parseInt(companyId) : null;
    
    if (newCompany) {
      const company = await prisma.company.create({
        data: {
          name: newCompany.name,
          logoUrl: newCompany.logoUrl || null,
          website: newCompany.website || null,
          contact: newCompany.contact || null,
          ownerId: userId,
        },
      });
      finalCompanyId = company.id;
    }

    // Generate QR code with smaller size and error correction
    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000';
    const qrCodeUrl = await QRCode.toDataURL(`${baseUrl}/u/${username}`, {
      width: 200,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Debug: Log the profile image size
    if (profileImage) {
      console.log('E-card creation debug:', {
        profileImageLength: profileImage.length,
        profileImagePreview: profileImage.substring(0, 100) + '...'
      });
    }

    // Create new e-card
    const ecard = await prisma.eCard.create({
      data: {
        username,
        fullName,
        title: title || null,
        phone: phone || null,
        email: email || null,
        linkedin: linkedin || null,
        profileImage: profileImage || null,
        coverImage: coverImage || null,
        companyId: finalCompanyId,
        qrCodeUrl,
        ownerId: userId,
      },
      include: {
        company: true,
      },
    });

    return NextResponse.json({
      message: "E-card created successfully",
      ecard,
    });
  } catch (error) {
    console.error("Error creating e-card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET - Fetch user's companies
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    console.log("Company API - Session:", session);
    console.log("Company API - User ID:", session?.user?.id);

    if (!session?.user?.id) {
      console.log("Company API - Unauthorized: No session or user ID");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);

    const companies = await prisma.company.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        id: 'desc'
      }
    });

    return NextResponse.json({ companies });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new company
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, logoUrl, website, contact } = await request.json();
    const userId = parseInt(session.user.id);

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    // Create new company
    const company = await prisma.company.create({
      data: {
        name,
        logoUrl: logoUrl || null,
        website: website || null,
        contact: contact || null,
        ownerId: userId,
      },
    });

    return NextResponse.json({
      message: "Company created successfully",
      company,
    });
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

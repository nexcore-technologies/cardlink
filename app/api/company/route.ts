import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET - Fetch user's company
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

    const company = await prisma.company.findUnique({
      where: {
        ownerId: userId,
      },
    });

    return NextResponse.json({ company });
  } catch (error) {
    console.error("Error fetching company:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create or update company
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

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

    // Check if user already has a company
    const existingCompany = await prisma.company.findUnique({
      where: {
        ownerId: userId,
      },
    });

    let company;

    if (existingCompany) {
      // Update existing company
      company = await prisma.company.update({
        where: {
          id: existingCompany.id,
        },
        data: {
          name,
          logoUrl: logoUrl || null,
          website: website || null,
          contact: contact || null,
        },
      });
    } else {
      // Create new company
      company = await prisma.company.create({
        data: {
          name,
          logoUrl: logoUrl || null,
          website: website || null,
          contact: contact || null,
          ownerId: userId,
        },
      });
    }

    return NextResponse.json({
      message: existingCompany ? "Company updated successfully" : "Company created successfully",
      company,
    });
  } catch (error) {
    console.error("Error creating/updating company:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

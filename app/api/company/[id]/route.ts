import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// PUT - Update specific company
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const companyId = parseInt(params.id);
    const userId = parseInt(session.user.id);
    const { name, logoUrl, website, contact } = await request.json();

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    // Check if company exists and belongs to user
    const existingCompany = await prisma.company.findFirst({
      where: {
        id: companyId,
        ownerId: userId,
      },
    });

    if (!existingCompany) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    // Update company
    const company = await prisma.company.update({
      where: {
        id: companyId,
      },
      data: {
        name,
        logoUrl: logoUrl || null,
        website: website || null,
        contact: contact || null,
      },
    });

    return NextResponse.json({
      message: "Company updated successfully",
      company,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete specific company
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const companyId = parseInt(params.id);
    const userId = parseInt(session.user.id);

    // Check if company exists and belongs to user
    const existingCompany = await prisma.company.findFirst({
      where: {
        id: companyId,
        ownerId: userId,
      },
    });

    if (!existingCompany) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    // Delete company
    await prisma.company.delete({
      where: {
        id: companyId,
      },
    });

    return NextResponse.json({
      message: "Company deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

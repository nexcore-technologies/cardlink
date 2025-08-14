import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PUT - Update existing company
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions) as { user: { id: string } } | null;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const companyId = parseInt(params.id);
    const userId = parseInt(session.user.id);

    if (!companyId || isNaN(companyId)) {
      return NextResponse.json(
        { error: "Invalid company ID" },
        { status: 400 }
      );
    }

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
        { error: "Company not found or access denied" },
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
    const session = await getServerSession(authOptions) as { user: { id: string } } | null;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const companyId = parseInt(params.id);
    const userId = parseInt(session.user.id);

    if (!companyId || isNaN(companyId)) {
      return NextResponse.json(
        { error: "Invalid company ID" },
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
        { error: "Company not found or access denied" },
        { status: 404 }
      );
    }

    // Check if company is linked to any e-cards
    const linkedEcards = await prisma.eCard.findMany({
      where: {
        companyId: companyId,
      },
    });

    if (linkedEcards.length > 0) {
      // Remove company from linked e-cards
      await prisma.eCard.updateMany({
        where: {
          companyId: companyId,
        },
        data: {
          companyId: null,
        },
      });
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

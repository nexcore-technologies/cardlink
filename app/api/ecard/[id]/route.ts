import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PUT - Update existing e-card
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions) as { user: { id: string } } | null;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const ecardId = parseInt(resolvedParams.id);

    if (!ecardId || isNaN(ecardId)) {
      return NextResponse.json(
        { error: "Invalid e-card ID" },
        { status: 400 }
      );
    }

    const { username, fullName, title, phone, email, linkedin, profileImage, companyId, newCompany } = await request.json();
    const userId = parseInt(session.user.id);

    // Validate required fields
    if (!username || !fullName) {
      return NextResponse.json(
        { error: "Username and full name are required" },
        { status: 400 }
      );
    }

    // Check if e-card exists and belongs to user
    const existingEcard = await prisma.eCard.findFirst({
      where: {
        id: ecardId,
        ownerId: userId,
      },
    });

    if (!existingEcard) {
      return NextResponse.json(
        { error: "E-card not found or access denied" },
        { status: 404 }
      );
    }

    // Check if username is already taken by another e-card
    const usernameConflict = await prisma.eCard.findFirst({
      where: {
        username: username,
        id: { not: ecardId },
      },
    });

    if (usernameConflict) {
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

    // Update e-card
    const ecard = await prisma.eCard.update({
      where: {
        id: ecardId,
      },
      data: {
        username,
        fullName,
        title: title || null,
        phone: phone || null,
        email: email || null,
        linkedin: linkedin || null,
        profileImage: profileImage || null,
        companyId: finalCompanyId,
      },
      include: {
        company: true,
      },
    });

    return NextResponse.json({
      message: "E-card updated successfully",
      ecard,
    });
  } catch (error) {
    console.error("Error updating e-card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete specific e-card
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions) as { user: { id: string } } | null;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const ecardId = parseInt(resolvedParams.id);
    const userId = parseInt(session.user.id);

    if (!ecardId || isNaN(ecardId)) {
      return NextResponse.json(
        { error: "Invalid e-card ID" },
        { status: 400 }
      );
    }

    // Check if e-card exists and belongs to user
    const existingEcard = await prisma.eCard.findFirst({
      where: {
        id: ecardId,
        ownerId: userId,
      },
    });

    if (!existingEcard) {
      return NextResponse.json(
        { error: "E-card not found or access denied" },
        { status: 404 }
      );
    }

    // Delete e-card
    await prisma.eCard.delete({
      where: {
        id: ecardId,
      },
    });

    return NextResponse.json({
      message: "E-card deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting e-card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import sharp from "sharp";

export const dynamic = "force-dynamic";

// POST - Upload image
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as { user: { id: string } } | null;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Compress and convert image to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Compress image using sharp
    const compressedBuffer = await sharp(buffer)
      .resize(300, 300, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ 
        quality: 80,
        progressive: true 
      })
      .toBuffer();
    
    const base64 = compressedBuffer.toString('base64');
    const mimeType = 'image/jpeg'; // Always JPEG after compression
    const dataUrl = `data:${mimeType};base64,${base64}`;
    
    // Debug: Log the size of the data URL
    console.log('Image upload debug:', {
      originalSize: file.size,
      compressedSize: compressedBuffer.length,
      base64Size: base64.length,
      dataUrlSize: dataUrl.length,
      mimeType: mimeType
    });

    return NextResponse.json({
      success: true,
      imageUrl: dataUrl,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type
    });

  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

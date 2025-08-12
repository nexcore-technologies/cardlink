import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      hasSession: !!session,
      session: session,
      env: {
        hasSecret: !!process.env.NEXTAUTH_SECRET,
        secretLength: process.env.NEXTAUTH_SECRET?.length || 0,
        hasUrl: !!process.env.NEXTAUTH_URL,
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: "Session check failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

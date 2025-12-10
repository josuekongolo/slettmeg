import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const platform = await db.platform.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!platform) {
      return NextResponse.json(
        { error: "Platform not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(platform);
  } catch (error) {
    console.error("Error fetching platform:", error);
    return NextResponse.json(
      { error: "Failed to fetch platform" },
      { status: 500 }
    );
  }
}

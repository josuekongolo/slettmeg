import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const createUserPlatformSchema = z.object({
  platformId: z.string(),
  username: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET() {
  try {
    const user = await requireAuth();

    const userPlatforms = await db.userPlatform.findMany({
      where: { userId: user.id },
      include: { platform: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(userPlatforms);
  } catch (error) {
    console.error("Error fetching user platforms:", error);
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const validated = createUserPlatformSchema.parse(body);

    // Check if already exists
    const existing = await db.userPlatform.findUnique({
      where: {
        userId_platformId: {
          userId: user.id,
          platformId: validated.platformId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Platform already added" },
        { status: 400 }
      );
    }

    const userPlatform = await db.userPlatform.create({
      data: {
        userId: user.id,
        platformId: validated.platformId,
        username: validated.username,
        notes: validated.notes,
        status: "NOT_STARTED",
      },
      include: { platform: true },
    });

    return NextResponse.json(userPlatform, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating user platform:", error);
    return NextResponse.json(
      { error: "Failed to add platform" },
      { status: 500 }
    );
  }
}

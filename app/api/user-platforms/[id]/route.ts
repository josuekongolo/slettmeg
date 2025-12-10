import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const updateUserPlatformSchema = z.object({
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "ACTION_REQUIRED"]).optional(),
  username: z.string().optional(),
  notes: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const validated = updateUserPlatformSchema.parse(body);

    const userPlatform = await db.userPlatform.updateMany({
      where: {
        id,
        userId: user.id,
      },
      data: validated,
    });

    if (userPlatform.count === 0) {
      return NextResponse.json(
        { error: "Platform not found" },
        { status: 404 }
      );
    }

    const updated = await db.userPlatform.findUnique({
      where: { id },
      include: { platform: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating user platform:", error);
    return NextResponse.json(
      { error: "Failed to update platform" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const deleted = await db.userPlatform.deleteMany({
      where: {
        id,
        userId: user.id,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Platform not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user platform:", error);
    return NextResponse.json(
      { error: "Failed to remove platform" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const updateRequestSchema = z.object({
  status: z.enum(["PENDING", "SUBMITTED", "IN_PROGRESS", "COMPLETED", "REJECTED", "ACTION_REQUIRED"]).optional(),
  message: z.string().optional(),
  response: z.string().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();

    const deletionRequest = await db.deletionRequest.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
      include: { platform: true },
    });

    if (!deletionRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(deletionRequest);
  } catch (error) {
    console.error("Error fetching request:", error);
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const validated = updateRequestSchema.parse(body);

    const deletionRequest = await db.deletionRequest.updateMany({
      where: {
        id: params.id,
        userId: user.id,
      },
      data: {
        ...validated,
        ...(validated.status === "COMPLETED" && { completedAt: new Date() }),
        ...(validated.status === "SUBMITTED" && !body.submittedAt && { submittedAt: new Date() }),
      },
    });

    if (deletionRequest.count === 0) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    const updated = await db.deletionRequest.findUnique({
      where: { id: params.id },
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
    console.error("Error updating request:", error);
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();

    const deleted = await db.deletionRequest.deleteMany({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting request:", error);
    return NextResponse.json(
      { error: "Failed to delete request" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const createRequestSchema = z.object({
  platformId: z.string(),
  type: z.enum(["ACCOUNT_DELETION", "DATA_EXPORT", "GDPR_REQUEST", "PARTIAL_DELETION"]),
  message: z.string().optional(),
});

export async function GET() {
  try {
    const user = await requireAuth();

    const requests = await db.deletionRequest.findMany({
      where: { userId: user.id },
      include: { platform: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
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
    const validated = createRequestSchema.parse(body);

    const deletionRequest = await db.deletionRequest.create({
      data: {
        userId: user.id,
        platformId: validated.platformId,
        type: validated.type,
        message: validated.message,
        status: "PENDING",
      },
      include: { platform: true },
    });

    return NextResponse.json(deletionRequest, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating request:", error);
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 }
    );
  }
}

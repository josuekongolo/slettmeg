import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { sendGDPREmail } from "@/lib/email";
import { generateGDPRRequest, generateEmailSubject } from "@/lib/gdpr-generator";
import { db } from "@/lib/db";
import { z } from "zod";

const sendGDPRSchema = z.object({
  platformId: z.string(),
  platformName: z.string(),
  platformEmail: z.string().email(),
  requestType: z.enum(["deletion", "export", "access", "correction"]),
  userName: z.string().optional(),
  userEmail: z.string().email().optional(),
  accountIdentifier: z.string().optional(),
  additionalInfo: z.string().optional(),
  requestId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const validated = sendGDPRSchema.parse(body);

    // Generate GDPR letter
    const letter = generateGDPRRequest({
      userName: validated.userName || user.name || "Bruker",
      userEmail: validated.userEmail || user.email!,
      platformName: validated.platformName,
      accountIdentifier: validated.accountIdentifier,
      requestType: validated.requestType,
      additionalInfo: validated.additionalInfo,
    });

    const subject = generateEmailSubject(validated.requestType, validated.platformName);

    // Send email to platform
    await sendGDPREmail({
      to: validated.platformEmail,
      subject,
      text: letter,
      ccUser: user.email!,
    });

    // Update deletion request if provided
    if (validated.requestId) {
      await db.deletionRequest.update({
        where: { id: validated.requestId },
        data: {
          submittedAt: new Date(),
          status: "SUBMITTED",
          message: letter,
        },
      });
    } else {
      // Create new deletion request
      await db.deletionRequest.create({
        data: {
          userId: user.id,
          platformId: validated.platformId,
          type: "GDPR_REQUEST",
          status: "SUBMITTED",
          message: letter,
          submittedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "GDPR-forespørsel sendt vellykket",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("GDPR email error:", error);
    return NextResponse.json(
      { error: "Failed to send GDPR request" },
      { status: 500 }
    );
  }
}

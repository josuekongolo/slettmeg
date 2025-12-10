import { streamText } from "ai";
import { openai as openaiProvider } from "@ai-sdk/openai";
import { SYSTEM_PROMPT } from "@/lib/openai";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const { messages } = await request.json();

    // Save user message to database
    const userMessage = messages[messages.length - 1];
    if (userMessage.role === "user") {
      await db.chatMessage.create({
        data: {
          userId: user.id,
          role: "user",
          content: userMessage.content,
        },
      });
    }

    // Stream text using AI SDK v5
    const result = await streamText({
      model: openaiProvider("gpt-4-turbo-preview"),
      system: SYSTEM_PROMPT,
      messages,
      temperature: 0.7,
      async onFinish({ text }) {
        // Save assistant message to database
        await db.chatMessage.create({
          data: {
            userId: user.id,
            role: "assistant",
            content: text,
          },
        });
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat message" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET() {
  try {
    const user = await requireAuth();

    const messages = await db.chatMessage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    return Response.json(messages);
  } catch (error) {
    console.error("Chat history error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch chat history" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

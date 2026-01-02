import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/domain/session/session.service";
import { z } from "zod";

const createSessionSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  expectedPlayerCount: z.number().int().min(1).max(50).default(4),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createSessionSchema.parse(body);

    const session = await createSession(data);

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { joinSession } from "@/domain/player/player.service";
import { z } from "zod";

const joinSchema = z.object({
  name: z.string().min(1).max(50),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name } = joinSchema.parse(body);

    const player = await joinSession(id, name);

    return NextResponse.json(player, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    if (error.message === "Session not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error.message === "Session is not open for registration") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

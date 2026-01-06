import { NextResponse } from "next/server";
import { finishSession } from "@/domain/session/session.service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const session = await finishSession(id);
    return NextResponse.json(session);
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

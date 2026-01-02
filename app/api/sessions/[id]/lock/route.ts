import { NextRequest, NextResponse } from "next/server";
import { lockSession } from "@/domain/session/session.service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await lockSession(id);
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to lock session" },
      { status: 500 }
    );
  }
}

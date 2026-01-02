import { NextRequest, NextResponse } from "next/server";
import { publishSession } from "@/domain/session/session.service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await publishSession(id);
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to publish session" },
      { status: 500 }
    );
  }
}

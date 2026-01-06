import { NextRequest, NextResponse } from "next/server";
import { resetSessionToDraft } from "@/domain/session/session.service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await resetSessionToDraft(id);
    return NextResponse.json(session);
  } catch {
    return NextResponse.json(
      { error: "Failed to reset session to draft" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { updateDisplayHeartbeat } from "@/domain/display/display.service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { target } = body as { target: "DISPLAY_1" | "DISPLAY_2" };

    if (!target) {
      return NextResponse.json({ error: "Missing target" }, { status: 400 });
    }

    await updateDisplayHeartbeat(id, target);

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Error updating display heartbeat:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import {
  updateDisplayState,
  getDisplayState,
} from "@/domain/display/display.service";
import { DisplayAction } from "@/domain/display/display.types";
import { publishEvent } from "@/lib/supabase/realtime";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, isDisplay2Available } = body as {
      action: DisplayAction;
      isDisplay2Available: boolean;
    };

    if (!action || !action.type) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const newState = await updateDisplayState(id, action, isDisplay2Available);

    // Broadcast l'événement realtime
    await publishEvent(id, "display:updated", newState as any);

    return NextResponse.json(newState);
  } catch (error) {
    console.error("Error updating display state:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const state = await getDisplayState(id);
    return NextResponse.json(state);
  } catch (error) {
    console.error("Error fetching display state:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

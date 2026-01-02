import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/domain/session/session.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const checkConnectivity = searchParams.get("checkConnectivity") === "true";

    const session = await getSession(id, checkConnectivity);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

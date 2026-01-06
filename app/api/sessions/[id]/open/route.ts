import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { openSession } = await import("@/domain/session/session.service");
    const session = await openSession(id);

    // TODO: Notifier via Realtime si nécessaire (normalement pg_notify ou le client le gère)

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error opening session:", error);
    return NextResponse.json(
      { error: "Failed to open session" },
      { status: 500 }
    );
  }
}

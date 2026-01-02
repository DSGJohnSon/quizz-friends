import { NextRequest, NextResponse } from "next/server";
import { awardPoints } from "@/domain/score/score.service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { points, reason } = body;

    if (typeof points !== "number") {
      return NextResponse.json(
        { error: "Points must be a number" },
        { status: 400 }
      );
    }

    const result = await awardPoints(
      id,
      points,
      reason || "Intervention du présentateur"
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating player score:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

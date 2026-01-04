import { getSession } from "@/domain/session/session.service";
import { getDisplayState } from "@/domain/display/display.service";
import { DisplayManager } from "@/components/game/display-manager";
import { notFound } from "next/navigation";

export default async function Game2Page({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const session = await getSession(sessionId);
  const displayState = await getDisplayState(sessionId);

  if (!session) {
    notFound();
  }

  return (
    <DisplayManager
      session={session}
      initialDisplayState={displayState}
      displayTarget="DISPLAY_2"
    />
  );
}

import { getSession } from "@/domain/session/session.service";
import { HostManager } from "@/components/host/host-manager";
import { notFound } from "next/navigation";
import { getDisplayState } from "@/domain/display/display.service";

export default async function HostSessionPage({
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
    <div>
      <HostManager session={session} initialDisplayState={displayState} />
    </div>
  );
}

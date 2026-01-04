import { getSession } from "@/domain/session/session.service";
import { HostControlPanel } from "@/components/host/control-panel";
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
    <div className="container mx-auto p-8 max-w-7xl">
      <HostControlPanel session={session} initialDisplayState={displayState} />
    </div>
  );
}

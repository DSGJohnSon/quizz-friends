import { listSessions } from "@/domain/session/session.service";
import { SessionList } from "@/components/host/session-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function HostPage() {
  const sessions = await listSessions();

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Panneau d&apos;administration</h1>
        <Link href="/host/create">
          <Button size="lg">Nouvelle session</Button>
        </Link>
      </div>

      <SessionList sessions={sessions} />
    </div>
  );
}

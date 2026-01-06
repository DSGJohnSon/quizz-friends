import BgAnimated from "@/components/bg-animated";
import { GameLogo } from "@/components/game/game-logo";
import { JoinSessionForm } from "@/components/player/join-session-form";

export default async function PlayerPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>;
}) {
  const { session } = await searchParams;

  return (
    <div className="h-screen flex items-center justify-center p-4 relative">
      <div>
        <GameLogo size={"SMALL"} />
      </div>
      <JoinSessionForm sessionCode={session} />
      <BgAnimated />
    </div>
  );
}

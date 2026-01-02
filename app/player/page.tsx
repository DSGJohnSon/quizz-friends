import { JoinSessionForm } from "@/components/player/join-session-form";

export default async function PlayerPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>;
}) {
  const { session } = await searchParams;

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <JoinSessionForm sessionCode={session} />
    </div>
  );
}

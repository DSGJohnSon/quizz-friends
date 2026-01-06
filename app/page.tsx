import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">Quiz Friends</h1>
        <p className="text-2xl mb-8 opacity-90">
          Application de quiz multi-écrans en temps réel
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/host">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white bg-white/10 hover:bg-white/20"
            >
              Panneau d&apos;administration
            </Button>
          </Link>
          <Link href="/player">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white bg-white/10 hover:bg-white/20"
            >
              Rejoindre une session
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

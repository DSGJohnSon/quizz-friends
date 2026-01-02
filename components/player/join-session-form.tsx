"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function JoinSessionForm({ sessionCode }: { sessionCode?: string }) {
  const router = useRouter();
  const [code, setCode] = useState(sessionCode || "");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Vérifier si le joueur a déjà rejoint cette session
  useEffect(() => {
    if (sessionCode) {
      const savedData = localStorage.getItem(`player_${sessionCode}`);
      if (savedData) {
        try {
          const { playerId, sessionId } = JSON.parse(savedData);
          // Rediriger automatiquement vers la salle d'attente
          router.push(`/player/${sessionId}?playerId=${playerId}`);
        } catch (e) {
          // Si erreur de parsing, on ignore
          console.error("Error parsing saved player data:", e);
        }
      }
    }
  }, [sessionCode, router]);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Récupérer la session par code
      const sessionRes = await fetch(`/api/sessions/by-code/${code}`);
      if (!sessionRes.ok) {
        throw new Error("Session introuvable");
      }
      const session = await sessionRes.json();

      // Rejoindre la session
      const joinRes = await fetch(`/api/sessions/${session.id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!joinRes.ok) {
        const data = await joinRes.json();
        throw new Error(data.error || "Impossible de rejoindre");
      }

      const player = await joinRes.json();

      // Sauvegarder les infos du joueur dans localStorage
      localStorage.setItem(
        `player_${code}`,
        JSON.stringify({
          playerId: player.id,
          sessionId: session.id,
          playerName: player.name,
          joinedAt: new Date().toISOString(),
        })
      );

      // Rediriger vers la salle d'attente
      router.push(`/player/${session.id}?playerId=${player.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md p-8 bg-white">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
        Rejoindre le quiz
      </h1>

      <form onSubmit={handleJoin} className="space-y-4">
        <div>
          <Input
            placeholder="Code de session"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={6}
            required
            className="text-center text-2xl font-mono"
          />
        </div>

        <div>
          <Input
            placeholder="Votre nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            required
          />
        </div>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full" size="lg">
          {loading ? "Connexion..." : "Rejoindre"}
        </Button>
      </form>
    </Card>
  );
}

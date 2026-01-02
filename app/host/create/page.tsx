"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CreateSessionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      expectedPlayerCount: parseInt(
        formData.get("expectedPlayerCount") as string
      ),
    };

    try {
      const response = await fetch("/api/sessions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create session");

      const session = await response.json();
      router.push(`/host/${session.id}`);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création de la session");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold mb-8">Créer une session</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">Titre de la session</Label>
          <Input
            id="title"
            name="title"
            required
            placeholder="Quiz du vendredi soir"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="description">Description (optionnel)</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Une soirée quiz entre amis..."
            rows={3}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="expectedPlayerCount">
            Nombre de joueurs attendus
          </Label>
          <Input
            id="expectedPlayerCount"
            name="expectedPlayerCount"
            type="number"
            min="1"
            max="50"
            defaultValue="4"
            required
            className="mt-2"
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Création..." : "Créer la session"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}

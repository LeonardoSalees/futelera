import { ScoreboardClient } from "@/components/score-board-client";
import { MatchService } from "@/services/match-service";
import { notFound } from "next/navigation";


interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ConfrontoPage({ params }: PageProps) {
  const { id } = await params;
  const match = await MatchService.getConfrontationById(id);

  if (!match) return notFound();

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 flex flex-col items-center justify-center">
      <ScoreboardClient 
      match={match}
        matchId={match.id}
        teamA={match.teams[0]}
        teamB={match.teams[1]}
        initialScore={{ a: match.scoreA, b: match.scoreB }}
      />
    </main>
  );
}
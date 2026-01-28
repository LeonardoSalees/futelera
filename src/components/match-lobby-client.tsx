"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Play } from "lucide-react";

interface Team {
  id: string;
  name: string;
}

interface MatchLobbyProps {
  matchDayId: string;
  teams: Team[];
}

export function MatchLobbyClient({ matchDayId, teams }: MatchLobbyProps) {
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
    if (!teamA || !teamB || teamA === teamB) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/matches/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchDayId, teamAId: teamA, teamBId: teamB })
      });

      if (!response.ok) throw new Error("Falha ao iniciar");

      const match = await response.json();
      // Redireciona para a tela do placar da partida específica criada
      router.push(`/confronto/${match.id}`);
    } catch (err) {
      alert("Erro ao iniciar a partida. Verifique a conexão.");
    } finally {
      setLoading(false);
    }
  };

  console.log(teams)
  return (
    <Card className="border-2 border-blue-100 shadow-xl bg-slate-50">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Play className="h-5 w-5 text-blue-600 fill-blue-600" />
          Configurar Próximo Jogo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500">Time da Casa</label>
            <select 
              value={teamA} 
              onChange={(e) => setTeamA(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Selecione...</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500">Visitante</label>
            <select 
              value={teamB} 
              onChange={(e) => setTeamB(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Selecione...</option>
              {teams.map(t => (
                <option key={t.id} value={t.id} disabled={t.id === teamA}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button 
          onClick={handleStart} 
          disabled={!teamA || !teamB || loading}
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : "APITAR INÍCIO"}
        </Button>
      </CardContent>
    </Card>
  );
}
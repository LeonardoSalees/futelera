"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function ResultadoPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
 console.log
  const handleConfirmarPartida = async () => {
    setIsSaving(true);
    
    try {
      const response = await fetch("/api/matches/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teams }),
      });

      if (!response.ok) throw new Error("Erro ao salvar");

      const data = await response.json();
      
      // Redireciona para o placar da partida criada
      router.push(`/partida/${data.matchId}`);
    } catch (err) {
      alert("Erro ao salvar a partida na nuvem. Tente novamente.");
      setIsSaving(false);
    }
  };


  useEffect(() => {
    // Busca os dados do LocalStorage
    const saved = localStorage.getItem("ultimo_sorteio");
    
    if (!saved) {
      // Se o usuário entrar direto no link sem sortear, volta pros jogadores
      router.replace("/jogadores");
      return;
    }

    setTeams(JSON.parse(saved));
  }, [router]);

  if (teams.length === 0) return null; // Ou um esqueleto de loading

  return (
    <main className="p-4 max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">Times Sorteados</h1>

      <div className="grid gap-4">
        {teams.map((team, i) => (
          <Card key={i} className="border-l-4 border-l-green-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-green-700">{team.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {team.players.map((p: any) => (
                  <li key={p.id} className="flex justify-between text-sm border-b border-slate-50 py-1">
                    <span>{p.name}</span>
                    <span className="text-slate-400">Nível {p.rating}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="fixed bottom-17 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
        <Button 
          onClick={handleConfirmarPartida}
          disabled={isSaving}
          className="w-full h-14 bg-green-600 hover:bg-green-700 text-lg font-bold"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              GRAVANDO NO BANCO...
            </>
          ) : (
            "CONFIRMAR E INICIAR JOGO"
          )}
        </Button>
      </div>
    </main>
  );
}
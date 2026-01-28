"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, RotateCcw, Save, ArrowLeft, ChevronUp, User } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export function ScoreboardClient({ matchId, teamA, teamB, initialScore }: any) {
  const [score, setScore] = useState(initialScore);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [goalModal, setGoalModal] = useState<{ open: boolean; team: "A" | "B" | null }>({
    open: false,
    team: null,
  });
  const router = useRouter();
  const handleFinishMatch = async () => {
    if (!confirm("Deseja realmente encerrar a partida? O placar será travado.")) return;
    
    const res = await fetch(`/api/matches/${matchId}/finish`, { method: "POST" });
    if (res.ok) {
      router.push(`/partida/${matchId}`); // Volta para a tela da pelada
      router.refresh();
    }
  };

  // DEBUG: Se os nomes não aparecerem, veja o que está vindo aqui
  console.log("Time A:", teamA);
  console.log("Time B:", teamB);

  // Garante que os jogadores existam antes de renderizar a lista
  const currentTeamPlayers = goalModal.team === "A" 
    ? (teamA?.players || []) 
    : (teamB?.players || []);

  // Cronômetro
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  // Abrir seleção de artilheiro
  const openGoalSelection = (team: "A" | "B") => {
    if (!isActive) {
      alert("Inicie o cronômetro para registrar ações!");
      return;
    }
    setGoalModal({ open: true, team });
  };

  // Registrar o Gol Oficial
  const handleRegisterGoal = async (playerId: string) => {
    const team = goalModal.team;
    if (!team) return;

    // Optimistic UI
    const newScore = { ...score };
    if (team === "A") newScore.a += 1;
    else newScore.b += 1;
    setScore(newScore);
    setGoalModal({ open: false, team: null });

    try {
      // Chama a nova lógica de RegisterGoal que criamos no Service
      await fetch(`/api/matches/${matchId}/goals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId }),
      });
    } catch (e) {
      console.error("Erro ao salvar gol");
    }
  };


  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase">
          <ArrowLeft className="h-4 w-4" /> Encerrar Painel
        </Link>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`} />
          <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">
            {isActive ? "Partida em Andamento" : "Partida Pausada"}
          </span>
        </div>
      </div>

      {/* Placar Principal */}
      <Card className="bg-slate-950 border-slate-800 shadow-2xl rounded-[3rem] overflow-hidden">
        <div className="p-8 space-y-10">
          
          {/* Timer Section */}
          <div className="text-center space-y-4">
            <div className={`text-8xl font-black font-mono tracking-tighter ${isActive ? 'text-white' : 'text-slate-700'}`}>
              {formatTime(seconds)}
            </div>
            <div className="flex justify-center gap-3">
              <Button 
                onClick={() => setIsActive(!isActive)} 
                variant={isActive ? "destructive" : "default"}
                className="rounded-full px-10 h-12 font-black uppercase tracking-widest transition-all"
              >
                {isActive ? "Pausar Jogo" : "Começar Jogo"}
              </Button>
              <Button onClick={() => setSeconds(0)} variant="outline" className="rounded-full h-12 w-12 border-slate-800 bg-slate-900">
                <RotateCcw className="h-5 w-5 text-slate-400" />
              </Button>
            </div>
          </div>

          {/* Confronto Visual */}
          <div className="flex items-center justify-between gap-4">
            {/* Time A */}
            <div className="flex-1 flex flex-col items-center space-y-6">
              <h2 className="text-2xl font-black text-blue-500 italic uppercase tracking-tighter">{teamA?.name}</h2>
              <div className="text-9xl font-black text-white leading-none tracking-tighter">{score.a}</div>
              <Button 
                disabled={!isActive}
                onClick={() => openGoalSelection("A")}
                className="w-full h-20 bg-blue-600 hover:bg-blue-500 rounded-2xl shadow-lg shadow-blue-900/40 text-2xl font-black"
              >
                GOL +
              </Button>
            </div>

            <div className="flex flex-col items-center text-slate-800 font-black italic text-2xl">VS</div>

            {/* Time B */}
            <div className="flex-1 flex flex-col items-center space-y-6">
              <h2 className="text-2xl font-black text-amber-500 italic uppercase tracking-tighter">{teamB?.name}</h2>
              <div className="text-9xl font-black text-white leading-none tracking-tighter">{score.b}</div>
              <Button 
                disabled={!isActive}
                onClick={() => openGoalSelection("B")}
                className="w-full h-20 bg-amber-600 hover:bg-amber-500 rounded-2xl shadow-lg shadow-amber-900/40 text-2xl font-black"
              >
                GOL +
              </Button>
            </div>
          </div>
        </div>

        {/* Barra de Status Inferior */}
        <div className="bg-slate-900/50 p-4 border-t border-slate-800 flex justify-center">
            <Button 
        onClick={handleFinishMatch}
        variant="ghost" 
        className="text-slate-500 hover:text-red-400 font-black uppercase tracking-[0.2em] gap-2"
      >
        <Save className="h-4 w-4" /> Encerrar Súmula e Salvar
      </Button>
        </div>
      </Card>

      {/* Modal de Seleção de Artilheiro */}
      <Dialog open={goalModal.open} onOpenChange={(open: any) => !open && setGoalModal({ open, team: null })}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-black italic uppercase tracking-tighter">
              Quem marcou o gol?
            </DialogTitle>
            <DialogDescription className="text-center text-slate-400 text-xs">
              Selecione o craque do Time {goalModal.team}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            {currentTeamPlayers?.map((player: any) => (
              <Button
                key={player.id}
                onClick={() => handleRegisterGoal(player.id)}
                variant="outline"
                className="h-14 justify-start gap-4 border-slate-800 bg-slate-950 hover:bg-blue-600 hover:text-white transition-all rounded-xl"
              >
                <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <span className="font-bold uppercase tracking-tight">{player.name}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
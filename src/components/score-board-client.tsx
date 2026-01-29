"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, ArrowLeft, Trophy, Clock, Zap } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function ScoreboardClient({ match, matchId, teamA, teamB, initialScore }: any) {
  const [score, setScore] = useState(initialScore);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [goalsTimeline, setGoalsTimeline] = useState<any[]>(match.goals || []);
  const [goalProcess, setGoalProcess] = useState<{
    open: boolean; team: "A" | "B" | null; scorerId: string | null; step: "scorer" | "assistant";
  }>({ open: false, team: null, scorerId: null, step: "scorer" });

  const router = useRouter();

  // --- CRONÔMETRO ---
  useEffect(() => {
    if (match.status === "playing" && match.startTime) {
      const start = new Date(match.startTime).getTime();
      const tick = () => {
        const now = new Date().getTime();
        const elapsedSinceStart = Math.floor((now - start) / 1000);
        setSeconds((match.timerOffset || 0) + elapsedSinceStart);
      };
      tick();
      const interval = setInterval(tick, 1000);
      setIsActive(true);
      return () => clearInterval(interval);
    } else {
      setSeconds(match.timerOffset || 0);
      setIsActive(false);
    }
  }, [match]);

  const sortedTimeline = useMemo(() => {
    return [...goalsTimeline].sort((a, b) => {
      const timeA = a.minute ?? 0;
      const timeB = b.minute ?? 0;
      return timeB - timeA;
    });
  }, [goalsTimeline]);

  const toggleTimer = async () => {
    const newStatus = isActive ? "paused" : "playing";
    try {
      await fetch(`/api/matches/${matchId}/timer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, timerOffset: seconds }),
      });
      router.refresh();
    } catch (e) { console.error(e); }
  };

  const handleFinalizeGoal = async (assistantId: string | null) => {
    const { team, scorerId } = goalProcess;
    if (!team || !scorerId) return;

    const currentMinute = Math.floor(seconds / 60);

    // Buscamos os nomes localmente para garantir que a UI atualize mesmo se o backend demorar
    const scorerObj = currentPlayers.find((p: any) => p.id === scorerId);
    const assistantObj = assistantId ? currentPlayers.find((p: any) => p.id === assistantId) : null;

    try {
      const res = await fetch(`/api/matches/${matchId}/goals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          playerId: scorerId, 
          assistantId, 
          minute: currentMinute,
          teamSide: team 
        }),
      });
      
      if (res.ok) {
        const newGoal = await res.json();
        
        // Se o backend não devolveu o objeto "player" completo, nós injetamos os nomes aqui
        const goalWithNames = {
          ...newGoal,
          player: newGoal.player || { name: scorerObj?.name },
          assistant: newGoal.assistant || (assistantObj ? { name: assistantObj?.name } : null)
        };

        setGoalsTimeline(prev => [goalWithNames, ...prev]);
        setScore((prev: any) => ({
          ...prev, [team.toLowerCase()]: prev[team.toLowerCase()] + 1
        }));
      }
    } catch (e) { console.error(e); }
    setGoalProcess({ open: false, team: null, scorerId: null, step: "scorer" });
  };

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const currentPlayers = goalProcess.team === "A" ? teamA?.players : teamB?.players;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-3 flex flex-col gap-4 select-none">
      {/* Scoreboard Card */}
      <Card className="max-w-2xl mx-auto w-full bg-gradient-to-b from-slate-900 to-black border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden mt-8">
        <div className="p-6 space-y-8">
          <div className="flex flex-col items-center">
            <div className="flex gap-2 mb-4">
              <Button onClick={toggleTimer} className={cn("h-10 px-6 rounded-xl font-black uppercase italic text-xs", isActive ? "bg-rose-600" : "bg-blue-600")}>
                {isActive ? "Pausar" : "Iniciar"}
              </Button>
              <Button onClick={() => setSeconds(0)} variant="outline" className="h-10 w-10 rounded-xl border-white/10 bg-white/5">
                <RotateCcw size={16} />
              </Button>
            </div>
            <div className={cn("text-7xl font-[1000] italic font-mono leading-none tracking-tighter", isActive ? "text-white" : "text-slate-700")}>
              {formatTime(seconds)}
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 pt-4 border-t border-white/5">
            <TeamDisplay name={teamA?.name} score={score.a} color="text-blue-500" isActive={isActive} onGoal={() => setGoalProcess({ open: true, team: "A", scorerId: null, step: "scorer" })} />
            <div className="text-zinc-800 font-black italic text-2xl px-2">VS</div>
            <TeamDisplay name={teamB?.name} score={score.b} color="text-amber-500" isActive={isActive} onGoal={() => setGoalProcess({ open: true, team: "B", scorerId: null, step: "scorer" })} />
          </div>
        </div>
      </Card>

      {/* LINHA DO TEMPO CORRIGIDA */}
      <div className="max-w-2xl mx-auto w-full space-y-4">
        <div className="flex items-center gap-3 px-2">
          <Clock size={14} className="text-slate-500" />
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Linha do Tempo</h3>
          <div className="h-[1px] flex-1 bg-white/5" />
        </div>

        <div className="space-y-2 pb-10">
          {sortedTimeline.length === 0 ? (
            <div className="text-center py-8 bg-white/5 rounded-3xl border border-dashed border-white/10 text-slate-600 font-bold text-[10px] uppercase">
              Aguardando gols...
            </div>
          ) : (
            sortedTimeline.map((goal: any) => (
              <div 
                key={goal.id} 
                className={cn(
                  "relative flex items-center gap-4 p-4 rounded-2xl border border-white/5 transition-all",
                  goal.teamSide === "A" 
                    ? "bg-blue-600/10 border-l-4 border-l-blue-600/50" 
                    : "bg-amber-600/10 border-r-4 border-r-amber-600/50 flex-row-reverse text-right"
                )}
              >
                <div className={cn("text-2xl font-[1000] italic", goal.teamSide === "A" ? "text-blue-500" : "text-amber-500")}>
                  {goal.minute}'
                </div>
                <div className="flex-1">
                  <div className={cn("flex items-center gap-2", goal.teamSide === "B" && "flex-row-reverse")}>
                    <Zap size={14} className={goal.teamSide === "A" ? "text-blue-500" : "text-amber-500"} />
                    <span className="font-black uppercase italic text-sm text-white">
                      {goal.player?.name || "Jogador"}
                    </span>
                  </div>
                  {goal.assistant?.name && (
                    <p className={cn("text-[10px] font-bold text-slate-400 mt-0.5 uppercase", goal.teamSide === "B" && "mr-1")}>
                      Garçom: <span className="text-slate-200 italic">{goal.assistant.name}</span>
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full mb-10">
        <Button onClick={() => confirm("Encerrar partida?") && router.push("/")} className="w-full h-14 bg-white text-black hover:bg-slate-200 rounded-2xl font-black uppercase italic">
          Finalizar Partida
        </Button>
      </div>

      {/* DIALOG DE SELEÇÃO */}
      <Dialog open={goalProcess.open} onOpenChange={(o) => setGoalProcess(p => ({ ...p, open: o }))}>
        <DialogContent className="bg-[#020617] border-white/10 text-white max-w-md rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-black uppercase italic">
              {goalProcess.step === "scorer" ? "Quem Marcou?" : "Assistência?"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 mt-4 max-h-[50vh] overflow-y-auto">
            {currentPlayers?.map((player: any) => (
              <button
                key={player.id}
                disabled={goalProcess.step === "assistant" && player.id === goalProcess.scorerId}
                onClick={() => goalProcess.step === "scorer" 
                  ? setGoalProcess(p => ({ ...p, scorerId: player.id, step: "assistant" })) 
                  : handleFinalizeGoal(player.id)}
                className="flex items-center gap-4 p-4 bg-white/5 hover:bg-blue-600 rounded-xl border border-white/5 text-left"
              >
                <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center font-black text-xs">
                  {player.name.substring(0,2).toUpperCase()}
                </div>
                <span className="font-black uppercase italic text-sm">{player.name}</span>
              </button>
            ))}
            {goalProcess.step === "assistant" && (
              <Button onClick={() => handleFinalizeGoal(null)} variant="ghost" className="text-slate-500 font-black uppercase text-xs mt-2">Sem Assistência</Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TeamDisplay({ name, score, color, isActive, onGoal }: any) {
  return (
    <div className="flex flex-col items-center gap-3 overflow-hidden">
      <h2 className={cn("text-[10px] font-black italic uppercase truncate w-full text-center px-1", color)}>
        {name || "Time"}
      </h2>
      <div className="text-7xl font-[1000] italic text-white leading-none tracking-tighter">
        {score}
      </div>
      <Button 
        disabled={!isActive} 
        onClick={onGoal} 
        className={cn(
          "w-full h-12 rounded-xl text-sm font-black italic uppercase",
          color === "text-blue-500" ? "bg-blue-600" : "bg-amber-600"
        )}
      >
        GOL
      </Button>
    </div>
  );
}
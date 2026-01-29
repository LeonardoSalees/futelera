"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Save, ArrowLeft, User, Trophy, Star } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function ScoreboardClient({ match, matchId, teamA, teamB, initialScore }: any) {
  const [score, setScore] = useState(initialScore);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [lastGoalId, setLastGoalId] = useState<string | null>(null);
  const [goalProcess, setGoalProcess] = useState<{
    open: boolean; team: "A" | "B" | null; scorerId: string | null; step: "scorer" | "assistant";
  }>({ open: false, team: null, scorerId: null, step: "scorer" });

  const router = useRouter();

  // 1. RECUPERAÇÃO DO CRONÔMETRO (VIVO)
  useEffect(() => {
    if (match.status === "playing" && match.startTime) {
      const start = new Date(match.startTime).getTime();
      const now = new Date().getTime();
      const elapsedSinceStart = Math.floor((now - start) / 1000);
      setSeconds((match.timerOffset || 0) + elapsedSinceStart);
      setIsActive(true);
    } else {
      setSeconds(match.timerOffset || 0);
      setIsActive(match.status === "playing");
    }
  }, [match]);

  // 2. TICK DO INTERVALO LOCAL
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // 3. PLAY / PAUSE UNIFICADO (CHAMA A ROTA /TIMER)
  const toggleTimer = async () => {
    const newActiveState = !isActive;
    const newStatus = newActiveState ? "playing" : "paused";

    setIsActive(newActiveState);

    try {
      await fetch(`/api/matches/${matchId}/timer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          timerOffset: seconds, 
        }),
      });
    } catch (e) {
      console.error("Erro ao sincronizar timer:", e);
    }
  };

  // 4. FINALIZAR PARTIDA (TRAVA O PLACAR)
  const handleFinishMatch = async () => {
    if (!confirm("Deseja encerrar a partida? Isso enviará os dados para o ranking e não poderá ser desfeito.")) return;

    try {
      const res = await fetch(`/api/matches/${matchId}/timer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "finished",
          timerOffset: seconds,
        }),
      });

      if (res.ok) {
        alert("Partida finalizada com sucesso!");
        router.push("/");
        router.refresh();
      }
    } catch (e) {
      console.error("Erro ao finalizar:", e);
    }
  };

  const handleFinalizeGoal = async (assistantId: string | null) => {
    const { team, scorerId } = goalProcess;
    if (!team || !scorerId) return;

    setScore((prev: any) => ({
      ...prev,
      [team.toLowerCase()]: prev[team.toLowerCase()] + 1,
    }));
    setGoalProcess({ open: false, team: null, scorerId: null, step: "scorer" });

    try {
      const res = await fetch(`/api/matches/${matchId}/goals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: scorerId, assistantId }),
      });
      const goalData = await res.json();
      setLastGoalId(goalData.id);
    } catch (e) { console.error(e); }
  };

  const handleUndoLastGoal = async () => {
    if (!lastGoalId || !confirm("Anular último gol?")) return;
    try {
      const res = await fetch(`/api/matches/${matchId}/goals/${lastGoalId}`, { method: "DELETE" });
      if (res.ok) {
        const data = await res.json();
        setScore((prev: any) => ({
          ...prev, [data.teamSide.toLowerCase()]: Math.max(0, prev[data.teamSide.toLowerCase()] - 1)
        }));
        setLastGoalId(null);
      }
    } catch (e) { console.error(e); }
  };

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const currentPlayers = goalProcess.team === "A" ? teamA?.players : teamB?.players;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-2 md:p-4 pb-10 flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center max-w-4xl mx-auto w-full px-2">
        <Link href="/" className="text-slate-500 text-[9px] font-black uppercase flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" /> Sair
        </Link>
        <div className="flex items-center gap-2 bg-slate-900/50 px-2 py-1 rounded-full border border-slate-800">
          <div className={cn("h-1.5 w-1.5 rounded-full", isActive ? "bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" : "bg-slate-600")} />
          <span className="text-[8px] font-black uppercase">{isActive ? "Live" : "Pausado"}</span>
        </div>
      </div>

      <Card className="max-w-4xl mx-auto w-full bg-slate-900/40 border-slate-800 rounded-[2rem] overflow-hidden backdrop-blur-md">
        <div className="p-4 md:p-8 space-y-6">
          {/* Cronômetro */}
          <div className="flex flex-col items-center gap-2">
            <div className={cn("text-6xl md:text-8xl font-black font-mono tracking-tighter transition-all", isActive ? "text-white" : "text-slate-700")}>
              {formatTime(seconds)}
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={toggleTimer} 
                className={cn("h-10 px-6 rounded-xl font-black uppercase text-xs", isActive ? "bg-rose-600" : "bg-blue-600")}
              >
                {isActive ? "Pausar" : "Iniciar"}
              </Button>
              <Button onClick={() => confirm("Zerar tempo?") && setSeconds(0)} variant="outline" className="h-10 w-10 rounded-xl border-slate-800 bg-slate-950/50">
                <RotateCcw className="h-4 w-4 text-slate-500" />
              </Button>
            </div>
            {lastGoalId && (
              <button onClick={handleUndoLastGoal} className="text-[8px] font-black text-rose-500/60 uppercase tracking-widest mt-1">
                Desfazer último gol
              </button>
            )}
          </div>

          {/* Placar */}
          <div className="flex flex-row items-center justify-between gap-2 relative border-t border-slate-800/50 pt-6">
            <TeamZone 
              name={teamA?.name} score={score.a} color="text-blue-500" btnColor="bg-blue-600" 
              disabled={!isActive} onGoal={() => setGoalProcess({ open: true, team: "A", scorerId: null, step: "scorer" })}
            />
            <div className="text-slate-800 font-black italic text-xl px-2 text-center">VS</div>
            <TeamZone 
              name={teamB?.name} score={score.b} color="text-amber-500" btnColor="bg-amber-600" 
              disabled={!isActive} onGoal={() => setGoalProcess({ open: true, team: "B", scorerId: null, step: "scorer" })}
            />
          </div>
        </div>

        <div className="bg-black/40 p-3 flex justify-center border-t border-slate-800/50">
          <Button onClick={handleFinishMatch} variant="ghost" className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] gap-2">
            <Trophy className="h-3 w-3" /> Encerrar Súmula
          </Button>
        </div>
      </Card>

      {/* Modais de Gol */}
      <Dialog open={goalProcess.open} onOpenChange={(o) => !o && setGoalProcess(p => ({ ...p, open: o }))}>
        <DialogContent className="bg-[#020617] border-slate-800 text-white max-w-[90vw] rounded-[2rem] p-6">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-black uppercase italic">
              {goalProcess.step === "scorer" ? "Quem marcou?" : "Assistência?"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 py-4 max-h-[50vh] overflow-y-auto px-1">
            {currentPlayers?.map((player: any) => (
              <Button
                key={player.id}
                disabled={goalProcess.step === "assistant" && player.id === goalProcess.scorerId}
                onClick={() => goalProcess.step === "scorer" 
                  ? setGoalProcess(p => ({ ...p, scorerId: player.id, step: "assistant" })) 
                  : handleFinalizeGoal(player.id)}
                variant="outline" className="h-12 justify-start px-4 border-slate-800 bg-slate-900 rounded-xl"
              >
                <User className="h-4 w-4 mr-3 opacity-50" />
                <span className="font-bold text-sm truncate">{player.name}</span>
              </Button>
            ))}
            {goalProcess.step === "assistant" && (
              <Button onClick={() => handleFinalizeGoal(null)} variant="ghost" className="h-12 text-slate-500 text-xs font-bold uppercase">Sem assistência</Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TeamZone({ name, score, color, btnColor, onGoal, disabled }: any) {
  return (
    <div className="flex-1 flex flex-col items-center gap-3 overflow-hidden">
      <h2 className={cn("text-[10px] md:text-xs font-black italic uppercase truncate w-full text-center", color)}>{name}</h2>
      <div className="text-6xl md:text-9xl font-black text-white leading-none tracking-tighter">{score}</div>
      <Button disabled={disabled} onClick={onGoal} className={cn("w-full h-14 rounded-2xl text-xl font-black italic", btnColor)}>
        GOL
      </Button>
    </div>
  );
}
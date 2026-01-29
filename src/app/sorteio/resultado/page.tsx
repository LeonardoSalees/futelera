"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, ArrowRightLeft, Trophy, CheckCircle2, 
  Users2, ArrowLeftRight 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function ResultadoPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  // Média técnica do time
  const calculatePower = (players: any[]) => {
    if (players.length === 0) return 0;
    const total = players.reduce((acc, p) => acc + p.rating, 0);
    return (total / players.length).toFixed(1);
  };

  // Troca direcionada de time
  const transferPlayer = (playerId: string, fromIdx: number, toIdx: number) => {
    const newTeams = [...teams];
    const playerIdx = newTeams[fromIdx].players.findIndex((p: any) => p.id === playerId);
    const [player] = newTeams[fromIdx].players.splice(playerIdx, 1);
    
    newTeams[toIdx].players.push(player);
    setTeams(newTeams);
    toast.success(`${player.name} movido para ${newTeams[toIdx].name}`);
  };

  const handleConfirmarPartida = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/matches/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teams }),
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      router.push(`/confronto/${data.matchId}`);
    } catch (err) {
      toast.error("Erro ao salvar a partida.");
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("ultimo_sorteio");
    if (!saved) { router.replace("/jogadores"); return; }
    setTeams(JSON.parse(saved));
  }, [router]);

  if (teams.length === 0) return null;

  return (
    <main className="p-4 max-w-md mx-auto space-y-8 pb-32">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">Confronto Definido</h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Equilibre os times antes do apito inicial</p>
      </div>

      <div className="grid gap-8">
        {teams.map((team, teamIdx) => {
          const power = calculatePower(team.players);
          const count = team.players.length;

          return (
            <div key={teamIdx} className="relative pt-6">
              {/* Indicadores Superiores (Força e Total) */}
              <div className="absolute -top-1 left-4 right-4 z-10 flex justify-between items-center">
                <Badge className="bg-blue-600 text-white border-2 border-[#020617] px-3 py-1 flex items-center gap-1.5 shadow-xl">
                  <Trophy size={10} className="fill-current" />
                  <span className="text-[10px] font-black uppercase tracking-tighter">Power: {power}</span>
                </Badge>
                
                <Badge className="bg-slate-800 text-slate-300 border-2 border-[#020617] px-3 py-1 flex items-center gap-1.5 shadow-xl">
                  <Users2 size={10} />
                  <span className="text-[10px] font-black uppercase tracking-tighter">{count} Atletas</span>
                </Badge>
              </div>

              <Card className="bg-slate-900/40 border-slate-800 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
                <CardHeader className="bg-slate-900/60 border-b border-slate-800/50 py-4 text-center">
                  <CardTitle className="text-sm font-black uppercase italic tracking-[0.2em] text-blue-500">
                    {team.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-5 space-y-2">
                  {team.players.map((p: any) => (
                    <div 
                      key={p.id} 
                      className="flex justify-between items-center bg-slate-950/40 p-3 rounded-[1.5rem] border border-white/5"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-200 text-xs uppercase tracking-tight">{p.name}</span>
                        <div className="flex gap-0.5 mt-0.5">
                          {Array.from({ length: p.rating }).map((_, i) => (
                            <div key={i} className="h-0.5 w-2 bg-blue-500 rounded-full" />
                          ))}
                        </div>
                      </div>
                      
                      {/* Seletor de Destino da Troca */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl bg-slate-900 hover:bg-blue-600 text-slate-500 hover:text-white transition-all">
                            <ArrowLeftRight size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200 rounded-xl">
                          <DropdownMenuLabel className="text-[10px] font-black uppercase opacity-50">Mover para:</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-slate-800" />
                          {teams.map((t, idx) => (
                            idx !== teamIdx && (
                              <DropdownMenuItem 
                                key={idx} 
                                onClick={() => transferPlayer(p.id, teamIdx, idx)}
                                className="font-bold uppercase text-xs focus:bg-blue-600 focus:text-white"
                              >
                                {t.name}
                              </DropdownMenuItem>
                            )
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Botão de Finalização */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50">
        <Button 
          onClick={handleConfirmarPartida}
          disabled={isSaving}
          className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-[0_20px_40px_-10px_rgba(37,99,235,0.5)] flex items-center justify-center gap-3 transition-all active:scale-95 group"
        >
          {isSaving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Escalação Final</span>
                <span className="text-lg font-black uppercase italic tracking-tight">Confirmar Confronto</span>
              </div>
              <CheckCircle2 className="h-6 w-6 opacity-40 group-hover:opacity-100 transition-opacity" />
            </>
          )}
        </Button>
      </div>
    </main>
  );
}
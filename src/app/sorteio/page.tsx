"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Play, Users, Shuffle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SorteioPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Busca os times que foram sorteados e salvos no localStorage na tela anterior
    const saved = localStorage.getItem("temp_teams");
    if (saved) {
      setTeams(JSON.parse(saved));
    } else {
      // Se não tem nada, volta para selecionar jogadores
      router.push("/jogadores");
    }
  }, [router]);

  const handleConfirmarEIniciar = async () => {
    setLoading(true);
    try {
      // Aqui criamos a "MatchDay" (A Noite) e a primeira partida no banco
      const res = await fetch("/api/matches/start-night", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teams }),
      });

      if (res.ok) {
        const data = await res.json();
        // Redireciona para o Placar da primeira partida (o Scoreboard que arrumamos)
        router.push(`/confronto/${data.firstMatchId}`);
      }
    } catch (error) {
      console.error("Erro ao iniciar pelada:", error);
    } finally {
      setLoading(false);
    }
  };

  if (teams.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 pb-32">
      {/* Navbar Superior */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-8">
        <Link href="/jogadores" className="p-2 hover:bg-slate-800 rounded-full transition-colors">
          <ArrowLeft className="h-6 w-6 text-slate-400" />
        </Link>
        <h1 className="text-lg font-black uppercase italic tracking-widest text-white">Confrontos Definidos</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header de Status */}
        <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-[2.5rem] text-center space-y-2">
          <div className="inline-flex p-3 bg-blue-600 rounded-2xl mb-2">
            <Shuffle className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-black uppercase italic text-white tracking-tighter">O sorteio foi justo!</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Times equilibrados com base no nível técnico</p>
        </div>

        {/* Lista de Times Gerados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team, idx) => (
            <Card key={idx} className="bg-slate-900/40 border-slate-800 rounded-[2rem] backdrop-blur-md overflow-hidden transition-all">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Time {idx + 1}</span>
                  <Users className="h-4 w-4 text-slate-700" />
                </div>
                <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter">
                  {team.name || `Esquadrão ${String.fromCharCode(65 + idx)}`}
                </h3>
                
                <div className="space-y-1.5 pt-2">
                  {team.players.map((player: any) => (
                    <div key={player.id} className="flex items-center justify-between bg-white/5 p-2 px-4 rounded-xl">
                      <span className="text-sm font-bold uppercase tracking-tight">{player.name}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: player.rating || 3 }).map((_, i) => (
                          <div key={i} className="h-1 w-3 bg-blue-500 rounded-full" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Dica de Próximo Passo */}
        <div className="text-center pt-4">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
            Ao iniciar, a primeira partida será gerada automaticamente
          </p>
        </div>
      </div>

      {/* Botão de Ação Fixo (Mobile Master) */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent z-50">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={handleConfirmarEIniciar}
            disabled={loading}
            className="w-full h-20 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(37,99,235,0.5)] flex items-center justify-center gap-4 group transition-all active:scale-95"
          >
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Tudo pronto</span>
              <span className="text-xl font-black uppercase italic">Autorizar Início</span>
            </div>
            <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all">
              <Play className="h-5 w-5 fill-white" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
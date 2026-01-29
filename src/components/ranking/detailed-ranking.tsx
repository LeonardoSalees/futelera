"use client";

import { Target, ChevronRight, Trophy, Flame, Zap } from "lucide-react";
import Image from "next/image";

interface PlayerRanking {
  id: string;
  name: string;
  rating: number;
  goalsCount: number;
  assistsCount: number;
  matchesCount: number;
  average: number;
  avatarURL?: string | null;
}

export function RankingAgressivo({ players }: { players: PlayerRanking[] }) {
  // O primeiro lugar já está no destaque do "Rei da Arena", então listamos do 2º em diante
  const listaRestante = players.slice(1);

  return (
    <div className="w-full space-y-3">
      {listaRestante.map((player, index) => {
        const posicao = index + 2;
        
        return (
          <div
            key={player.id}
            className="group relative flex items-center gap-4 p-4 bg-zinc-950/60 hover:bg-blue-950/20 border-l-4 border-l-transparent hover:border-l-blue-600 border-y border-r border-white/5 rounded-r-2xl transition-all duration-300"
          >
            {/* POSIÇÃO COM ESTILO PLACAR */}
            <div className="flex flex-col items-center justify-center min-w-[30px]">
              <span className="text-2xl font-[1000] italic leading-none text-zinc-700 group-hover:text-blue-500 transition-colors">
                {posicao < 10 ? `${posicao}` : posicao} º
              </span>
            </div>

            {/* AVATAR COM ROTAÇÃO ESTILIZADA */}
            <div className="relative shrink-0">
              <div className="h-14 w-14 rounded-xl overflow-hidden border border-white/10 bg-zinc-900 flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-500">
                {player.avatarURL ? (
                  <Image 
                    src={player.avatarURL} 
                    alt={player.name} 
                    fill 
                    className="object-cover"
                  />
                ) : (
                  <span className="text-sm font-black text-zinc-600 uppercase">
                    {player.name.substring(0, 2)}
                  </span>
                )}
              </div>
              
              {/* Badge "On Fire" se a média for alta */}
              {player.average >= 2 && (
                <div className="absolute -top-2 -right-2 bg-orange-600 p-1 rounded-md shadow-lg animate-pulse">
                  <Flame size={10} className="text-white fill-current" />
                </div>
              )}
            </div>

            {/* INFO DO ARTILHEIRO */}
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-[900] uppercase italic tracking-tighter text-white truncate group-hover:text-blue-400 transition-colors">
                {player.name}
              </h4>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <Target size={10} className="text-zinc-500" />
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    {player.matchesCount} {player.matchesCount === 1 ? 'JOGO' : 'JOGOS'}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-blue-600/10 px-2 py-0.5 rounded-sm">
                  <Zap size={10} className="text-blue-500 fill-current" />
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-tighter">
                    MÉDIA {player.average.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* CONTADOR DE GOLS (O FOCO PRINCIPAL) */}
            <div className="flex items-center gap-4">
              <div className="h-10 w-[1px] bg-white/5" />
              <div className="text-right min-w-[50px]">
                <div className="flex flex-col">
                  <span className="text-4xl font-[1000] italic leading-[0.8] text-transparent bg-clip-text bg-gradient-to-t from-zinc-500 to-white tracking-tighter">
                    {player.goalsCount}
                  </span>
                  <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mt-1">
                    GOLS
                  </span>
                </div>
              </div>
              <ChevronRight size={16} className="text-zinc-800 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
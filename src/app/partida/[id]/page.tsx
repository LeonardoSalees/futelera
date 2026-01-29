import { notFound } from "next/navigation";
import { MatchService } from "@/services/match-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, Calendar, Trophy, PlayCircle, CheckCircle2 } from "lucide-react";
import { MatchLobbyClient } from "@/components/match-lobby-client";
import Link from "next/link";


interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PartidaPage({ params }: PageProps) {
  const { id } = await params;
  
  // Buscamos o MatchDay com todas as suas partidas relacionadas
  const match = await MatchService.getMatchById(id);
  const allTeamsSorted = await MatchService.getFullMatchDay(id)
  if (!match) return notFound();

  // 1. Pegamos todas as partidas do dia
  // 2. Usamos flatMap para "achatar" todos os times de todas as partidas em um único array
  // 3. Filtramos para garantir que cada time apareça apenas uma vez no Select
  const allTeamsOfTheDay = match.matchDay.matches
    .flatMap((m) => m.teams)
    .filter((team, index, self) => 
      index === self.findIndex((t) => t.id === team.id)
    );
  // REGRAS DE NEGÓCIO NA UI:
  // 1. Verificamos se já existe alguma partida rolando (status: playing)
  const activeMatch = match.matchDay.matches.find(m => m.status === "playing");
  // 2. Pegamos as partidas já encerradas para exibir o histórico
  const finishedMatches = match.matchDay.matches.filter(m => m.status === "finished");
console.log(allTeamsSorted)
  return (
    <main className="max-w-2xl mx-auto p-4 space-y-8 pb-24">
      {/* Cabeçalho dinâmico baseado no estado da Pelada */}
      <div className="text-center space-y-2 pt-6">
        <div className="flex justify-center items-center gap-2 text-slate-500 text-sm font-medium">
          <Calendar className="h-4 w-4" />
          {new Date(match.matchDay.date).toLocaleDateString('pt-BR')}
        </div>
        <h1 className="text-4xl font-black italic tracking-tighter uppercase">
          Arena Pelada
        </h1>
        <div className="flex justify-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 uppercase text-[10px]">
            {allTeamsSorted?._count.teams} Sorteados
          </Badge>
          {activeMatch && (
            <Badge className="bg-green-500 text-white border-none animate-pulse uppercase text-[10px]">
              Bola Rolando
            </Badge>
          )}
        </div>
      </div>

      {/* SEÇÃO 1: Partida Atual (Se houver) */}
      {activeMatch && (
        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl border-4 border-blue-500/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Partida em Andamento</span>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
          </div>
          <Link href={`/confronto/${activeMatch.id}`} className="group flex justify-between items-center">
             <div className="text-center flex-1">
                <p className="text-2xl font-black tracking-tighter uppercase italic">{activeMatch.teams[0].name}</p>
                <span className="text-4xl font-black text-blue-500">{activeMatch.scoreA}</span>
             </div>
             <div className="px-4 text-slate-500 font-black italic">VS</div>
             <div className="text-center flex-1">
                <p className="text-2xl font-black tracking-tighter uppercase italic">{activeMatch.teams[1].name}</p>
                <span className="text-4xl font-black text-amber-500">{activeMatch.scoreB}</span>
             </div>
          </Link>
          <Link href={`/confronto/${activeMatch.id}`} className="mt-6 flex items-center justify-center gap-2 w-full bg-white text-slate-900 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">
            <PlayCircle className="h-5 w-5" /> ASSUMIR O APITO
          </Link>
        </div>
      )}

      {/* SEÇÃO 3: Lobby de Início - Só aparece se NÃO houver partida ativa */}
      {!activeMatch ? (
        <MatchLobbyClient 
          matchDayId={match.matchDayId} 
          teams={allTeamsOfTheDay.map((t:any) => ({ id: t.id, name: t.name }))} 
        />
      ) : (
        <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center">
          <p className="text-sm text-slate-500 font-medium uppercase italic">
            Finalize a partida atual para iniciar um novo confronto
          </p>
        </div>
      )}
      <Separator />

      {/* SEÇÃO 4: Histórico do Dia */}
      {finishedMatches.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
            <Trophy className="h-4 w-4" /> Resultados da Noite
          </h3>
          <div className="grid gap-2">
            {finishedMatches.map(m => (
              <div key={m.id} className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                <span className="text-xs font-bold text-slate-600 uppercase italic">Jogo Encerrado</span>
                <div className="flex items-center gap-3 font-black text-slate-900">
                  <span>{m.scoreA}</span>
                  <span className="text-slate-300 text-xs italic font-normal">X</span>
                  <span>{m.scoreB}</span>
                </div>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEÇÃO 2: Times (Escalação) */}
      <div className="grid gap-6">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Escalações do Dia</h3>
        {match.teams.map((team, index) => (
          <Card key={team.id} className="overflow-hidden border-none shadow-md">
            <CardHeader className={`${index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-700'} text-white p-4`}>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 uppercase font-black text-sm tracking-widest">
                  <Users className="h-4 w-4" />
                  {team.name}
                </CardTitle>
                <span className="text-[10px] font-bold opacity-70 italic uppercase">
                  Nível: {MatchService.getTeamStrength(team)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0 bg-white">
              <div className="grid grid-cols-1 divide-y divide-slate-100">
                {team.players.map((player) => (
                  <div key={player.id} className="flex justify-between items-center p-3 px-4">
                    <span className="font-semibold text-slate-700">{player.name}</span>
                    <Badge variant="secondary" className="text-[10px] font-bold">NV {player.rating}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      

      

      
    </main>
  );
}
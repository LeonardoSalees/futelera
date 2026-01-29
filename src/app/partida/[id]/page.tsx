"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Calendar,
  Trophy,
  PlayCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { MatchLobbyClient } from "@/components/match-lobby-client";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import type { MatchService } from "@/services/match-service";
// Extraímos a tipagem exata do retorno do seu método do Service
type MatchDataType = Awaited<ReturnType<typeof MatchService.getFullMatchDay>>;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PartidaPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [match, setMatch] = useState<MatchDataType>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/matches/matchday/${id}`);
        console.log(res);
        if (!res.ok) throw new Error("Falha ao buscar");
        const json = await res.json();
        setMatch(json);
      } catch (err) {
        console.error("Erro na sincronização:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Polling opcional: Atualiza a cada 10 segundos para manter o placar vivo
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600" size={32} />
        <p className="mt-4 text-xs font-black uppercase text-slate-500">
          Sincronizando Arena...
        </p>
      </div>
    );

  // 2. Só dê notFound se o loading acabou E o match continua null
  if (!match) return console.log('ok');

  // 1. Pegamos todas as partidas do dia
  // 2. Usamos flatMap para "achatar" todos os times de todas as partidas em um único array
  // 3. Filtramos para garantir que cada time apareça apenas uma vez no Select
  const allTeamsOfTheDay = match.matches
    .flatMap((m) => m.teams)
    .filter(
      (team, index, self) => index === self.findIndex((t) => t.id === team.id),
    );
  // REGRAS DE NEGÓCIO NA UI:
  // 1. Verificamos se já existe alguma partida rolando (status: playing)
  const activeMatch = match.matches.find(
    (m) => m.status === "playing",
  );
  // 2. Pegamos as partidas já encerradas para exibir o histórico
  const finishedMatches = match.matches.filter(
    (m) => m.status === "finished",
  );
  return (
    <main className="max-w-2xl mx-auto p-4 space-y-8 pb-24">
      {/* Cabeçalho dinâmico baseado no estado da Pelada */}
      <div className="text-center space-y-2 pt-6">
        <div className="flex justify-center items-center gap-2 text-slate-500 text-sm font-medium">
          <Calendar className="h-4 w-4" />
          {new Date(match.date).toLocaleDateString("pt-BR")}
        </div>
        <h1 className="text-4xl font-black italic tracking-tighter uppercase">
          Arena Pelada
        </h1>
        <div className="flex justify-center gap-2">
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 uppercase text-[10px]"
          >
            {allTeamsOfTheDay.length} Sorteados
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
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
              Partida em Andamento
            </span>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
          </div>
          <Link
            href={`/confronto/${activeMatch.id}`}
            className="group flex justify-between items-center"
          >
            <div className="text-center flex-1">
              <p className="text-2xl font-black tracking-tighter uppercase italic">
                {activeMatch.teams[0].name}
              </p>
              <span className="text-4xl font-black text-blue-500">
                {activeMatch.scoreA}
              </span>
            </div>
            <div className="px-4 text-slate-500 font-black italic">VS</div>
            <div className="text-center flex-1">
              <p className="text-2xl font-black tracking-tighter uppercase italic">
                {activeMatch.teams[1].name}
              </p>
              <span className="text-4xl font-black text-amber-500">
                {activeMatch.scoreB}
              </span>
            </div>
          </Link>
          <Link
            href={`/confronto/${activeMatch.id}`}
            className="mt-6 flex items-center justify-center gap-2 w-full bg-white text-slate-900 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors"
          >
            <PlayCircle className="h-5 w-5" /> ASSUMIR O APITO
          </Link>
        </div>
      )}

      {/* SEÇÃO 3: Lobby de Início - Só aparece se NÃO houver partida ativa */}
      {!activeMatch ? (
        <MatchLobbyClient
          matchDayId={match.id}
          teams={allTeamsOfTheDay.map((t: any) => ({ id: t.id, name: t.name }))}
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
            {finishedMatches.map((m: any) => (
              <div
                key={m.id}
                className="flex flex-col p-4 bg-white rounded-xl shadow-sm border border-slate-100 gap-3"
              >
                {/* Status e Ícone */}
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                    Fim de Jogo
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>

                {/* Confronto e Placar */}
                <div className="flex justify-between items-center px-2">
                  {/* Time A */}
                  <div className="flex-1 text-right">
                    <span className="text-sm font-black uppercase italic text-slate-700 truncate block">
                      {m.teams[0]?.name || "Time A"}
                    </span>
                  </div>

                  {/* Placar Central */}
                  <div className="flex items-center gap-3 mx-4 bg-slate-950 px-3 py-1 rounded-lg text-white min-w-[80px] justify-center">
                    <span className="font-black text-lg">{m.scoreA}</span>
                    <span className="text-slate-600 text-[10px] italic">X</span>
                    <span className="font-black text-lg">{m.scoreB}</span>
                  </div>

                  {/* Time B */}
                  <div className="flex-1 text-left">
                    <span className="text-sm font-black uppercase italic text-slate-700 truncate block">
                      {m.teams[1]?.name || "Time B"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEÇÃO 2: Times (Escalação) */}
      <div className="grid gap-6">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
          Escalações do Dia
        </h3>
        {match.teams.map((team, index) => (
          <Card key={team.id} className="overflow-hidden border-none shadow-md">
            <CardHeader
              className={`${index % 2 === 0 ? "bg-slate-800" : "bg-slate-700"} text-white p-4`}
            >
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 uppercase font-black text-sm tracking-widest">
                  <Users className="h-4 w-4" />
                  {team.name}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 bg-white">
              <div className="grid grid-cols-1 divide-y divide-slate-100">
                {team.players.map((player) => (
                  <div
                    key={player.id}
                    className="flex justify-between items-center p-3 px-4"
                  >
                    <span className="font-semibold text-slate-700">
                      {player.name}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-bold"
                    >
                      NV {player.rating}
                    </Badge>
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

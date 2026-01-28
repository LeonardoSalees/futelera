// src/app/api/matches/confirm/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// O "export" e o nome "POST" são obrigatórios!
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teams } = body;

    if (!teams || teams.length === 0) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const match = await prisma.$transaction(async (tx) => {
      // 1. Cria o dia
      const matchDay = await tx.matchDay.create({
        data: { date: new Date() }
      });

      // 2. Cria a partida e conecta jogadores
      return await tx.match.create({
  data: {
    // 1. Conecta a partida ao dia
    matchDay: {
      connect: { id: matchDay.id }
    },
    status: "scheduled",
    // 2. Cria os times conectando-os TAMBÉM ao matchDay
    teams: {
      create: teams.map((team: any) => ({
        name: team.name,
        // REGRA: O time precisa saber a qual dia pertence
        matchDay: {
          connect: { id: matchDay.id }
        },
        players: {
          connect: team.players.map((p: any) => ({ id: p.id }))
        }
      }))
    }
  }
});
    });

    return NextResponse.json({ matchId: match.id }, { status: 201 });
  } catch (error) {
    console.error("Erro na API:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
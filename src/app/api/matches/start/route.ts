import { MatchService } from "@/services/match-service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { matchDayId, teamAId, teamBId } = await request.json();

    if (teamAId === teamBId) {
      return NextResponse.json({ error: "Escolha times diferentes" }, { status: 400 });
    }

    const match = await MatchService.createConfrontation(matchDayId, teamAId, teamBId);
    
    return NextResponse.json(match, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao iniciar confronto" }, { status: 500 });
  }
}
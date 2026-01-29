import { MatchService } from "@/services/match-service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const matchDay = await MatchService.latestMatchDay();
    
    if (!matchDay) {
      return NextResponse.json({ error: "Não encontrada" }, { status: 404 });
    }

    // Retorna apenas o ID para o frontend
    return NextResponse.json({ id: matchDay.id });
    
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
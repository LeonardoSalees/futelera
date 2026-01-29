import { MatchService } from "@/services/match-service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const currentMatchDay = await MatchService.getCurrentMatchDay();
    
    if (!currentMatchDay) return NextResponse.json(null);

    // Validação: Se a rodada tem mais de 12 horas, consideramos encerrada
    const TWELVE_HOURS = 12 * 60 * 60 * 1000;
    const isExpired = Date.now() - new Date(currentMatchDay.date).getTime() > TWELVE_HOURS;

    return NextResponse.json(isExpired ? null : currentMatchDay);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 });
  }
}
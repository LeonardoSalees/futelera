import { MatchService } from "@/services/match-service";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Note o Promise aqui
) {
  try {
    // 1. Unbox do params (Obrigatório no Next 15)
    const { id } = await params; 

    // 2. Agora o id não será mais undefined
    const matchDay = await MatchService.getFullMatchDay(id);
    if (!matchDay) {
      return NextResponse.json(
        { error: "Rodada não encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json(matchDay);
    
  } catch (error) {
    console.error("[MATCHDAY_GET_ERROR]:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar dados." },
      { status: 500 }
    );
  }
}
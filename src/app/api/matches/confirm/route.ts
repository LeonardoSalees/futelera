import { MatchService } from "@/services/match-service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { teams } = await request.json();

    // Validação básica de entrada (Responsabilidade da Rota)
    if (!teams || !Array.isArray(teams) || teams.length < 2) {
      return NextResponse.json(
        { error: "É necessário enviar pelo menos 2 times válidos." }, 
        { status: 400 }
      );
    }

    // Chamada do Serviço (Responsabilidade de Negócio)
    const match = await MatchService.confirmMatchDay(teams);

    return NextResponse.json({ matchId: match.id }, { status: 201 });
  } catch (error) {
    console.error("[CONFIRM_MATCH_POST]:", error);
    return NextResponse.json(
      { error: "Erro ao processar a criação da rodada." }, 
      { status: 500 }
    );
  }
}
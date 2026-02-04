import { MatchService } from "@/services/match-service";
import { NextRequest, NextResponse } from "next/server";

// 1. Defina um tipo comum para os parâmetros para evitar repetição
type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params; // Aguarda a Promise do ID
    const { action, team, value } = await request.json();

    if (action === "update_score") {
      const updatedMatch = await MatchService.registerGoal(id, team, value);
      return NextResponse.json(updatedMatch);
    }

    return NextResponse.json({ error: "Ação não permitida" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar partida" }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: RouteParams // 2. Corrigido de {params: {id: string}} para Promise
) {
  try {
    const { id } = await params; // 3. Adicionado o await necessário
    const matchDay = await MatchService.getMatchById(id);

    if (!matchDay) {
      return NextResponse.json({ error: "Rodada não encontrada" }, { status: 404 });
    }

    return NextResponse.json(matchDay);
  } catch (error) {
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
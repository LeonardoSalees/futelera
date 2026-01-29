import { MatchService } from "@/services/match-service";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { action, team, value } = await request.json();

    if (action === "update_score") {
      // O MatchService deve cuidar da lógica de incremento/decremento no Prisma
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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const matchDay = await MatchService.getMatchById(id);

    if (!matchDay) {
      return NextResponse.json({ error: "Rodada não encontrada" }, { status: 404 });
    }

    return NextResponse.json(matchDay);
  } catch (error) {
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
import { MatchService } from "@/services/match-service";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { playerId, assistantId } = await request.json();

    // Usa a regra de negócio atômica que criamos
    const goal = await MatchService.registerGoal(id, playerId, assistantId);

    return NextResponse.json(goal, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}


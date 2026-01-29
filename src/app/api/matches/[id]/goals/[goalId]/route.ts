import { MatchService } from "@/services/match-service";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; goalId: string }> },
) {
  try {
    const { id, goalId } = await params;

    const result = await MatchService.deleteGoal(id, goalId);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao deletar gol:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno ao deletar gol" },
      { status: 400 },
    );
  }
}

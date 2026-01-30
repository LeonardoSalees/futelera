import { MatchService } from "@/services/match-service";
import { NextResponse } from "next/server";

export async function POST(request: Request,
  { params }: { params: Promise<{ id: string }> } // Note o Promise aqui
) {
  try {
    // 1. Unbox do params (Obrigatório no Next 15)
    const { id } = await params; 
    await MatchService.finishMatchDay(id);
    
    return NextResponse.json({ message: "Rodada finalizada com sucesso!" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao finalizar rodada." }, { status: 500 });
  }
}
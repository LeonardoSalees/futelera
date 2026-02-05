import { NextResponse } from "next/server";
import { PlayerService } from "@/services/player-service";
import { MatchService } from "@/services/match-service";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { playerIds, teamNames } = body;

    if (!playerIds || playerIds.length < 2) {
      return NextResponse.json({ error: "Selecione pelo menos 2 jogadores." }, { status: 400 });
    }

    // 1. Busca os jogadores
    const allPlayers = await PlayerService.getAllPlayers();
    const selectedPlayers = allPlayers.filter(p => playerIds.includes(p.id));
    // 2. Prepara as configurações (se teamNames não vier, usamos os padrões)
    const configs = (teamNames || ["Time A", "Time B", "Time C", "Time D"]).map((name: string) => ({ name }));

    // 3. Aplica a lógica de sorteio do seu Service
    const teams = MatchService.balanceTeams(selectedPlayers, configs);
     revalidatePath("/ranking");
     revalidatePath("/jogadores");

    // Retornamos os times sorteados para o cliente decidir o que fazer
    return NextResponse.json(teams);
  } catch (error) {
    console.error("Erro no sorteio:", error);
    return NextResponse.json({ error: "Falha interna no sorteio." }, { status: 500 });
  }
}
import { prisma } from "@/lib/prisma";

export interface TeamConfig {
  name: string;
  color?: string;
}

export class MatchService {
  /**
   * Busca detalhes do sorteio inicial
   */
  static async getMatchById(id: string) {
  if (!id) return null;
  return await prisma.match.findUnique({
    where: { id },
    include: {
      matchDay: {
        include: {
          matches: {
            include: {
              teams: {
                include: { players: true }
              }
            }
          }
        }
      },
      teams: {
        include: { players: true }
      }
    },
  });
}

  /**
   * Busca um confronto específico para a tela de placar
   */
  static async getConfrontationById(id: string) {
    if (!id) return null;
    return await prisma.match.findUnique({
      where: { id },
      include: {
        teams: { include: { players: true } },
        goals: { include: { player: true } },
      },
    });
  }

  /**
   * REGRA: Cria um confronto e trava o status como 'playing'
   */
  static async createConfrontation(
    matchDayId: string,
    teamAId: string,
    teamBId: string,
  ) {
    // Validação: Não permite iniciar jogo se os times forem iguais
    if (teamAId === teamBId)
      throw new Error("Selecione dois times diferentes.");

    return await prisma.match.create({
      data: {
        matchDayId,
        status: "playing", // Inicia direto no modo de jogo
        teams: {
          connect: [{ id: teamAId }, { id: teamBId }],
        },
      },
    });
  }

  /**
   * REGRA DE OURO: Registro de Gol com Artilharia
   * Esta função substitui o simples updateScore para garantir integridade
   */
  static async registerGoal(
    matchId: string,
    playerId: string,
    assistantId?: string,
  ) {
    // 1. Busca a partida e verifica o status
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: { teams: { include: { players: true } } },
    });

    if (!match || match.status !== "playing") {
      throw new Error(
        "Ação bloqueada: O cronômetro deve estar rodando para registrar gols.",
      );
    }

    // 2. Identifica o time do marcador para atualizar o placar correto
    const isTeamA = match.teams[0].players.some((p) => p.id === playerId);
    const isTeamB = match.teams[1].players.some((p) => p.id === playerId);

    if (!isTeamA && !isTeamB) {
      throw new Error("Este jogador não faz parte da partida atual.");
    }

    // 3. Transação Atômica: Se um falhar, nada é salvo (Integridade Total)
    return await prisma.$transaction(async (tx) => {
      // Cria o registro do gol
      const goal = await tx.goal.create({
        data: {
          matchId,
          playerId,
          assistantId: assistantId || null,
        },
      });

      // Incrementa o placar da Match
      await tx.match.update({
        where: { id: matchId },
        data: {
          [isTeamA ? "scoreA" : "scoreB"]: { increment: 1 },
        },
      });

      return goal;
    });
  }

  /**
   * REGRA: Remove um gol e decrementa o placar (Correção de erro)
   */
  static async deleteLastGoal(matchId: string, goalId: string) {
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
      include: {
        match: { include: { teams: { include: { players: true } } } },
      },
    });
    if (!goal) return;

    const isTeamA = goal.match.teams[0].players.some(
      (p) => p.id === goal.playerId,
    );

    return await prisma.$transaction(async (tx) => {
      await tx.goal.delete({ where: { id: goalId } });
      await tx.match.update({
        where: { id: matchId },
        data: {
          [isTeamA ? "scoreA" : "scoreB"]: { decrement: 1 },
        },
      });
    });
  }

  /**
   * REGRA: Finaliza a partida e trava os dados
   */
  static async finishMatch(id: string) {
    return await prisma.match.update({
      where: { id },
      data: { status: "finished" },
    });
  }

  /**
   * Lógica de Sorteio (Snake Algorithm)
   */
  static balanceTeams(players: any[], configs: TeamConfig[]) {
    const sorted = [...players].sort(
      (a, b) => (b.rating || 0) - (a.rating || 0),
    );
    const teams = configs.map((config) => ({
      name: config.name,
      color: config.color,
      players: [] as any[],
    }));

    let forward = true;
    let currentTeam = 0;

    for (const player of sorted) {
      teams[currentTeam].players.push(player);
      if (forward) {
        if (currentTeam < teams.length - 1) currentTeam++;
        else forward = false;
      } else {
        if (currentTeam > 0) currentTeam--;
        else forward = true;
      }
    }
    return teams;
  }

  static getTeamStrength(input: any): string {
    const players = Array.isArray(input) ? input : input?.players;
    if (!Array.isArray(players) || players.length === 0) return "0.0";
    const sum = players.reduce((acc, p) => acc + (p.rating || 0), 0);
    return (sum / players.length).toFixed(1);
  }
}

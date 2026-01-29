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
                  include: { players: true },
                },
              },
            },
          },
        },
        teams: {
          include:{
            players: true
          }
        }
      },
    });
  }

  // Busca a Noite (Rodada) completa com contagem real de times
  static async getFullMatchDay(id: string) {
  return await prisma.matchDay.findUnique({
    where: { id },
    include: {
      teams: { include: { players: true } }, // Crucial para preencher o array teams
      matches: {
        orderBy: { createdAt: 'desc' },
        include: { teams: true }
      },
      _count: { select: { teams: true } }
    }
  });
}

  static async getCurrentMatchDay() {
  return await prisma.matchDay.findFirst({
    orderBy: { date: 'desc' },
    include: {
      // 1. ISSO AQUI TRAZ AS ESCALAÇÕES (O que estava faltando)
      teams: {
        include: {
          players: true
        }
      },
      // 2. Isso traz o placar do jogo atual
      matches: {
        orderBy: { createdAt: 'desc' },
        include: {
          teams: true
        }
      },
      // 3. Isso traz o número para o Badge
      _count: {
        select: {
          teams: true
        }
      }
    }
  });
}

  static async confirmMatchDay(teams: any[]) {
    return await prisma.$transaction(async (tx) => {
      // 1. Cria o MatchDay (A Noite)
      const matchDay = await tx.matchDay.create({
        data: { date: new Date() }
      });

      // 2. Cria os Times e o primeiro Confronto
      return await tx.match.create({
        data: {
          matchDay: {
            connect: { id: matchDay.id }
          },
          status: "scheduled",
          teams: {
            create: teams.map((team: any) => ({
              name: team.name,
              matchDay: {
                connect: { id: matchDay.id }
              },
              players: {
                connect: team.players.map((p: any) => ({ id: p.id }))
              }
            }))
          }
        },
        include: {
          teams: true // Retorna com os times para facilitar o uso no front
        }
      });
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
  static async deleteGoal(matchId: string, goalId: string) {
    return await prisma.$transaction(async (tx) => {
      // 1. Busca o gol para identificar quem marcou e a qual time pertence
      const goal = await tx.goal.findUnique({
        where: { id: goalId },
        include: {
          player: {
            include: {
              team: {
                where: { matchDay: { matches: { some: { id: matchId } } } },
              },
            },
          },
        },
      });

      if (!goal) throw new Error("Registro de gol não encontrado.");

      // 2. Busca a partida para identificar a posição dos times (A ou B)
      const match = await tx.match.findUnique({
        where: { id: matchId },
        include: { teams: true },
      });

      if (!match) throw new Error("Partida não encontrada.");

      // 3. Determina qual lado do placar deve ser decrementado
      // Comparamos o ID do time do jogador com o ID do primeiro time da partida
      const isTeamA = match.teams[0].id === goal.player.team[0].id;
      const teamSide = isTeamA ? "A" : "B";

      // 4. Executa a deleção do gol e assistência
      await tx.goal.delete({
        where: { id: goalId },
      });

      // 5. Atualiza o placar da partida (decrementando 1)
      const updatedMatch = await tx.match.update({
        where: { id: matchId },
        data: isTeamA
          ? { scoreA: { decrement: 1 } }
          : { scoreB: { decrement: 1 } },
      });

      return {
        match: updatedMatch,
        teamSide, // Retornamos o lado para atualizar a UI de forma otimista
      };
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

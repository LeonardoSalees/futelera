// src/services/playerService.ts
import {prisma} from '@/lib/prisma';

export const PlayerService = {
  // Busca todos os jogadores para a lista de presença
  async getAllPlayers() {
    return await prisma.player.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  },

  // Busca estatísticas para o ranking
  async getRanking() {
    const players = await prisma.player.findMany({
      include: {
        team: {
          include: {
            _count: { select: { matches: true } }
          }
        },
        _count: {
          select: { goals: true, assists: true }
        }
      }
    });

    return players.map(player => {
      const totalMatches = player.team.reduce((acc, t) => acc + t._count.matches, 0);
      const goals = player._count.goals;
      
      // Cálculo de média (evitando divisão por zero)
      const average = totalMatches > 0 ? (goals / totalMatches).toFixed(2) : "0.00";

      return {
        id: player.id,
        name: player.name,
        rating: player.rating,
        goalsCount: goals,
        assistsCount: player._count.assists,
        matchesCount: totalMatches,
        average: parseFloat(average)
      };
    }).sort((a, b) => b.goalsCount - a.goalsCount);
  }
};
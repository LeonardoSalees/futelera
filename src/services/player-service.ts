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
      where: { isActive: true }, // Opcional: apenas jogadores ativos
      include: {
        team: {
          include: {
            _count: { 
              select: { matches: true } // Conta em quantas partidas esse time participou
            }
          }
        },
        _count: {
          select: { goals: true, assists: true }
        }
      }
    });
    
    return players.map(player => {
      // Soma total de partidas de todos os times que o jogador participou
      const totalMatches = player.team.reduce((acc, t) => acc + (t._count?.matches || 0), 0);
      const goals = player._count?.goals || 0;
      const assists = player._count?.assists || 0;
      
      // Cálculo de média (evitando divisão por zero)
      const average = totalMatches > 0 ? (goals / totalMatches) : 0;

      return {
        id: player.id,
        name: player.name,
        rating: player.rating,
        goalsCount: goals,
        assistsCount: assists,
        matchesCount: totalMatches, // Este é o campo que você deve usar no componente
        average: parseFloat(average.toFixed(2))
      };
    }).sort((a, b) => b.goalsCount - a.goalsCount);
  }
};
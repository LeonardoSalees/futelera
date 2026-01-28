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
    return await prisma.player.findMany({
      include: {
        _count: {
          select: { goals: true, assists: true }
        }
      },
      orderBy: {
        goals: { _count: 'desc' }
      }
    });
  }
};
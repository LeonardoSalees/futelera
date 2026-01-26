// prisma/seed.ts

import { prisma } from "../src/lib/prisma"

async function main() {
  console.log('--- Limpando banco de dados ---')
  await prisma.goal.deleteMany()
  await prisma.match.deleteMany()
  await prisma.matchDay.deleteMany()
  await prisma.player.deleteMany()

  console.log('--- Cadastrando jogadores ---')
  const playersData = [
    { name: 'Neymar da Quinta', rating: 5 },
    { name: 'Zeca Pagodinho', rating: 2 },
    { name: 'Ronaldinho Gaucho', rating: 5 },
    { name: 'Casemiro do Bairro', rating: 4 },
    { name: 'Thiago Silva (Soberano)', rating: 4 },
    { name: 'Dinei do Pagode', rating: 3 },
    { name: 'Tico Miúdo', rating: 1 },
    { name: 'Beto "Caneta"', rating: 3 },
    { name: 'Vampeta da Galera', rating: 4 },
    { name: 'Gandula Profissional', rating: 1 },
    { name: 'Artilheiro de Aluguel', rating: 5 },
    { name: 'Goleiro de Boné', rating: 3 },
    { name: 'Lateral Cansado', rating: 2 },
    { name: 'Meia de Ligação', rating: 4 },
    { name: 'Zagueiro Carniceiro', rating: 3 },
  ]

  const players = await Promise.all(
    playersData.map((p) => prisma.player.create({ data: p }))
  )

  console.log('--- Criando uma noite de jogo de teste ---')
  const matchDay = await prisma.matchDay.create({
    data: {
      date: new Date(),
    },
  })

  console.log('--- Criando uma partida histórica ---')
  // Simula uma partida entre Time A e Time B
  const match = await prisma.match.create({
    data: {
      matchDayId: matchDay.id,
      teamAName: 'Os de Colete',
      teamBName: 'Sem Colete',
      scoreA: 2,
      scoreB: 1,
    },
  })

  console.log('--- Registrando gols e assistências ---')
  // Gol 1: Neymar faz gol com assistência do Ronaldinho
  await prisma.goal.create({
    data: {
      matchId: match.id,
      playerId: players.find(p => p.name === 'Neymar da Quinta')!.id,
      assistantId: players.find(p => p.name === 'Ronaldinho Gaucho')!.id,
    },
  })

  // Gol 2: Artilheiro de Aluguel faz gol sem assistência (individual)
  await prisma.goal.create({
    data: {
      matchId: match.id,
      playerId: players.find(p => p.name === 'Artilheiro de Aluguel')!.id,
      assistantId: null,
    },
  })

  // Gol 3 (Time B): Zeca Pagodinho faz gol com assistência do Vampeta
  await prisma.goal.create({
    data: {
      matchId: match.id,
      playerId: players.find(p => p.name === 'Zeca Pagodinho')!.id,
      assistantId: players.find(p => p.name === 'Vampeta da Galera')!.id,
    },
  })

  console.log('✅ Seed finalizado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
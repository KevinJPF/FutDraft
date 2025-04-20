// src/services/sorteioService.js
import { collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from './firebase';

// Função para embaralhar um array (algoritmo Fisher-Yates)
const embaralharArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Sortear os times conforme as regras especificadas
export const sortearTimes = (jogadores, jogadoresPorTime) => {
  if (!jogadores || jogadores.length < jogadoresPorTime * 2) {
    throw new Error("É necessário ter pelo menos jogadores suficientes para montar 2 times para realizar o sorteio");
  }

  const totalJogadores = jogadores.length;
  const numeroDeTimesCompletos = Math.floor(totalJogadores / jogadoresPorTime);
  const jogadoresRestantes = totalJogadores % jogadoresPorTime;
  const totalDeTimes = numeroDeTimesCompletos + (jogadoresRestantes > 0 ? 1 : 0);

  // Criar os times dinamicamente
  const times = Array.from({ length: totalDeTimes }, (_, i) => ({
    id: i + 1,
    nome: `Time ${i + 1}`,
    jogadores: [],
    media: 0
  }));

  // Separar jogadores com e sem prioridade
  const jogadoresComPrioridade = jogadores.filter(j => j.prioridade);
  const jogadoresSemPrioridade = jogadores.filter(j => !j.prioridade);

  // Ordenar os jogadores por geral
  const jogadoresComPrioridadeOrdenados = [...jogadoresComPrioridade].sort((a, b) => b.geral - a.geral);
  const jogadoresSemPrioridadeOrdenados = [...jogadoresSemPrioridade].sort((a, b) => b.geral - a.geral);

  // Calcular o número de coringas necessários (2 por time, exceto se o último tiver só 1 jogador)
  const ultimoTimeVaiTer1Jogador = jogadoresRestantes === 1;
  const totalCoringas = (totalDeTimes - (ultimoTimeVaiTer1Jogador ? 1 : 0)) * 2;
  const coringasNecessarios = Math.min(totalCoringas, jogadores.length);
  
  // Metade dos coringas são top, metade são bottom
  const topCoringasCount = Math.ceil(coringasNecessarios / 2);
  const bottomCoringasCount = coringasNecessarios - topCoringasCount;

  // Selecionar coringas com prioridade primeiro para os times 1 e 2
  let topCoringasComPrioridade = jogadoresComPrioridadeOrdenados.slice(0, topCoringasCount);
  let bottomCoringasComPrioridade = jogadoresComPrioridadeOrdenados.slice(-bottomCoringasCount);
  
  // Se não houver jogadores suficientes com prioridade, complementar com os sem prioridade
  if (topCoringasComPrioridade.length < topCoringasCount) {
    const faltam = topCoringasCount - topCoringasComPrioridade.length;
    topCoringasComPrioridade = [
      ...topCoringasComPrioridade,
      ...jogadoresSemPrioridadeOrdenados.slice(0, faltam)
    ];
  }
  
  if (bottomCoringasComPrioridade.length < bottomCoringasCount) {
    const faltam = bottomCoringasCount - bottomCoringasComPrioridade.length;
    bottomCoringasComPrioridade = [
      ...bottomCoringasComPrioridade,
      ...jogadoresSemPrioridadeOrdenados.slice(-faltam)
    ];
  }

  // Embaralhar os coringas
  const topCoringas = embaralharArray(topCoringasComPrioridade);
  const bottomCoringas = embaralharArray(bottomCoringasComPrioridade);
  
  // Remover os coringas da lista de jogadores disponíveis
  const coringasIds = [...topCoringas, ...bottomCoringas].map(j => j.id);
  const jogadoresDisponiveis = jogadores.filter(j => !coringasIds.includes(j.id));
  
  // Separar jogadores disponíveis com e sem prioridade
  const jogadoresDisponiveisComPrioridade = jogadoresDisponiveis.filter(j => j.prioridade);
  const jogadoresDisponiveisSemPrioridade = jogadoresDisponiveis.filter(j => !j.prioridade);
  
  // Embaralhar os jogadores disponíveis
  const jogadoresComPrioridadeEmbaralhados = embaralharArray(jogadoresDisponiveisComPrioridade);
  const jogadoresSemPrioridadeEmbaralhados = embaralharArray(jogadoresDisponiveisSemPrioridade);

  // Distribuir 1 top e 1 bottom por time
  let topIndex = 0;
  let bottomIndex = 0;

  for (let i = 0; i < totalDeTimes; i++) {
    if (i === totalDeTimes - 1 && ultimoTimeVaiTer1Jogador) break; // Não adicionar 2 coringas se o último time tiver só 1 jogador
    if (topIndex < topCoringas.length) times[i].jogadores.push(topCoringas[topIndex++]);
    if (bottomIndex < bottomCoringas.length) times[i].jogadores.push(bottomCoringas[bottomIndex++]);
  }

  // Distribuir os demais jogadores com prioridade para os times 1 e 2
  let indexJogadoresComPrioridade = 0;
  
  for (let i = 0; i < Math.min(2, totalDeTimes); i++) {
    while (times[i].jogadores.length < jogadoresPorTime && indexJogadoresComPrioridade < jogadoresComPrioridadeEmbaralhados.length) {
      times[i].jogadores.push(jogadoresComPrioridadeEmbaralhados[indexJogadoresComPrioridade++]);
    }
  }

  // Distribuir os jogadores sem prioridade para os times 3 em diante
  let indexJogadoresSemPrioridade = 0;
  
  for (let i = 2; i < totalDeTimes; i++) {
    const limitePorTime = (i === totalDeTimes - 1) ? (jogadoresRestantes || jogadoresPorTime) : jogadoresPorTime;
    
    while (times[i].jogadores.length < limitePorTime && indexJogadoresSemPrioridade < jogadoresSemPrioridadeEmbaralhados.length) {
      times[i].jogadores.push(jogadoresSemPrioridadeEmbaralhados[indexJogadoresSemPrioridade++]);
    }
  }

  // Se ainda faltam jogadores sem prioridade e os times 1 e 2 não estão completos, preenchê-los
  for (let i = 0; i < Math.min(2, totalDeTimes); i++) {
    while (times[i].jogadores.length < jogadoresPorTime && indexJogadoresSemPrioridade < jogadoresSemPrioridadeEmbaralhados.length) {
      times[i].jogadores.push(jogadoresSemPrioridadeEmbaralhados[indexJogadoresSemPrioridade++]);
    }
  }

  // Se ainda faltam jogadores com prioridade e os times 3+ não estão completos, preenchê-los
  for (let i = 2; i < totalDeTimes; i++) {
    const limitePorTime = (i === totalDeTimes - 1) ? (jogadoresRestantes || jogadoresPorTime) : jogadoresPorTime;
    
    while (times[i].jogadores.length < limitePorTime && indexJogadoresComPrioridade < jogadoresComPrioridadeEmbaralhados.length) {
      times[i].jogadores.push(jogadoresComPrioridadeEmbaralhados[indexJogadoresComPrioridade++]);
    }
  }

  // Calcular a média de geral de cada time
  times.forEach(time => {
    if (time.jogadores.length > 0) {
      const somaGeral = time.jogadores.reduce((acc, jogador) => acc + jogador.geral, 0);
      time.media = Math.round(somaGeral / time.jogadores.length);
    }
  });

  return times;
};

// Salvar o resultado do sorteio no Firestore
export const salvarSorteio = async (times) => {
  try {
    const resultado = {
      data: new Date(),
      times: times.map(time => ({
        id: time.id,
        nome: time.nome,
        media: time.media,
        jogadores: time.jogadores.map(j => ({
          id: j.id,
          nome: j.nome,
          posicao: j.posicao,
          geral: j.geral,
          imagem: j.imagem
        }))
      }))
    };
    
    const docRef = await addDoc(collection(db, 'sorteios'), resultado);
    return { id: docRef.id, ...resultado };
  } catch (error) {
    console.error("Erro ao salvar sorteio:", error);
    throw error;
  }
};

// Obter histórico dos últimos sorteios
export const obterHistoricoSorteios = async (quantidade = 3) => {
  try {
    const q = query(
      collection(db, 'sorteios'),
      orderBy('data', 'desc'),
      limit(quantidade)
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      data: doc.data().data.toDate()
    }));
  } catch (error) {
    console.error("Erro ao obter histórico de sorteios:", error);
    throw error;
  }
};

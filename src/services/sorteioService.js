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

  // Função auxiliar para embaralhar arrays (implementação do algoritmo Fisher-Yates)
  function embaralharArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  // Separar jogadores por prioridade
  const jogadoresComPrioridade = jogadores.filter(j => j.prioridade);
  const jogadoresSemPrioridade = jogadores.filter(j => !j.prioridade);

  // Ordenar jogadores por nível geral (do melhor para o pior)
  const jogadoresComPrioridadeOrdenados = [...jogadoresComPrioridade].sort((a, b) => b.geral - a.geral);
  const jogadoresSemPrioridadeOrdenados = [...jogadoresSemPrioridade].sort((a, b) => b.geral - a.geral);

  // Função para obter tops e bottoms de uma lista ordenada de jogadores
  function separarTopEBottom(jogadoresOrdenados) {
    if (jogadoresOrdenados.length <= 1) return { tops: jogadoresOrdenados, bottoms: [] };
    
    // Número de jogadores a considerar como tops/bottoms (no máximo 8 de cada ou metade do total)
    const quantidade = Math.min(8, Math.floor(jogadoresOrdenados.length / 2));
    
    const tops = jogadoresOrdenados.slice(0, quantidade);
    const bottoms = jogadoresOrdenados.slice(-quantidade);
    
    return { tops, bottoms };
  }

  // Separar tops e bottoms dos jogadores com prioridade
  const { tops: topsPrioridade, bottoms: bottomsPrioridade } = separarTopEBottom(jogadoresComPrioridadeOrdenados);
  
  // Separar tops e bottoms dos jogadores sem prioridade
  const { tops: topsSemPrioridade, bottoms: bottomsSemPrioridade } = separarTopEBottom(jogadoresSemPrioridadeOrdenados);

  // Embaralhar jogadores tops e bottoms
  const topsPrioridadeEmbaralhados = embaralharArray([...topsPrioridade]);
  const bottomsPrioridadeEmbaralhados = embaralharArray([...bottomsPrioridade]);
  const topsSemPrioridadeEmbaralhados = embaralharArray([...topsSemPrioridade]);
  const bottomsSemPrioridadeEmbaralhados = embaralharArray([...bottomsSemPrioridade]);

  // Jogadores do meio (nem tops nem bottoms)
  const jogadoresMeioPrioridade = jogadoresComPrioridadeOrdenados.filter(j => 
    !topsPrioridade.some(top => top.id === j.id) && 
    !bottomsPrioridade.some(bottom => bottom.id === j.id)
  );
  
  const jogadoresMeioSemPrioridade = jogadoresSemPrioridadeOrdenados.filter(j => 
    !topsSemPrioridade.some(top => top.id === j.id) && 
    !bottomsSemPrioridade.some(bottom => bottom.id === j.id)
  );

  // Embaralhar jogadores do meio
  const jogadoresMeioPrioridadeEmbaralhados = embaralharArray([...jogadoresMeioPrioridade]);
  const jogadoresMeioSemPrioridadeEmbaralhados = embaralharArray([...jogadoresMeioSemPrioridade]);

  // Distribuir jogadores nos times
  // Primeiro, distribuir alternadamente tops e bottoms com prioridade nos primeiros times
  let indexTopPrioridade = 0;
  let indexBottomPrioridade = 0;
  
  for (let i = 0; i < totalDeTimes; i++) {
    const time = times[i];
    
    // Adicionar até 2 tops com prioridade (se disponíveis)
    for (let j = 0; j < 2; j++) {
      if (indexTopPrioridade < topsPrioridadeEmbaralhados.length) {
        time.jogadores.push(topsPrioridadeEmbaralhados[indexTopPrioridade++]);
      }
    }
    
    // Adicionar até 2 bottoms com prioridade (se disponíveis)
    for (let j = 0; j < 2; j++) {
      if (indexBottomPrioridade < bottomsPrioridadeEmbaralhados.length) {
        time.jogadores.push(bottomsPrioridadeEmbaralhados[indexBottomPrioridade++]);
      }
    }
    
    // Parar se já distribuímos jogadores suficientes com prioridade
    if (indexTopPrioridade >= topsPrioridadeEmbaralhados.length && 
        indexBottomPrioridade >= bottomsPrioridadeEmbaralhados.length) {
      break;
    }
  }
  
  // Se ainda sobraram tops/bottoms com prioridade, continuar distribuindo
  for (let i = 0; i < totalDeTimes; i++) {
    const time = times[i];
    
    while (time.jogadores.length < jogadoresPorTime) {
      // Adicionar um top com prioridade se disponível
      if (indexTopPrioridade < topsPrioridadeEmbaralhados.length) {
        time.jogadores.push(topsPrioridadeEmbaralhados[indexTopPrioridade++]);
        continue;
      }
      
      // Adicionar um bottom com prioridade se disponível
      if (indexBottomPrioridade < bottomsPrioridadeEmbaralhados.length) {
        time.jogadores.push(bottomsPrioridadeEmbaralhados[indexBottomPrioridade++]);
        continue;
      }
      
      // Se não há mais tops/bottoms com prioridade, sair do loop
      break;
    }
  }
  
  // Distribuir jogadores do meio com prioridade
  let indexMeioPrioridade = 0;
  
  for (let i = 0; i < totalDeTimes; i++) {
    const time = times[i];
    
    while (time.jogadores.length < jogadoresPorTime && indexMeioPrioridade < jogadoresMeioPrioridadeEmbaralhados.length) {
      time.jogadores.push(jogadoresMeioPrioridadeEmbaralhados[indexMeioPrioridade++]);
    }
    
    // Parar se já distribuímos todos os jogadores com prioridade
    if (indexMeioPrioridade >= jogadoresMeioPrioridadeEmbaralhados.length) {
      break;
    }
  }
  
  // Agora vamos lidar com jogadores sem prioridade (nos últimos times)
  // Primeiro verificar quais times ainda precisam de jogadores
  const timesIncompletos = times.filter(time => time.jogadores.length < jogadoresPorTime);
  
  // Distribuir jogadores sem prioridade do último time para o primeiro
  const timesIncompletosReversos = [...timesIncompletos].reverse();
  
  let indexTopSemPrioridade = 0;
  let indexBottomSemPrioridade = 0;
  let indexMeioSemPrioridade = 0;
  
  for (const time of timesIncompletosReversos) {
    // Adicionar tops sem prioridade
    while (time.jogadores.length < jogadoresPorTime && indexTopSemPrioridade < topsSemPrioridadeEmbaralhados.length) {
      time.jogadores.push(topsSemPrioridadeEmbaralhados[indexTopSemPrioridade++]);
    }
    
    // Adicionar bottoms sem prioridade
    while (time.jogadores.length < jogadoresPorTime && indexBottomSemPrioridade < bottomsSemPrioridadeEmbaralhados.length) {
      time.jogadores.push(bottomsSemPrioridadeEmbaralhados[indexBottomSemPrioridade++]);
    }
    
    // Adicionar jogadores do meio sem prioridade
    while (time.jogadores.length < jogadoresPorTime && indexMeioSemPrioridade < jogadoresMeioSemPrioridadeEmbaralhados.length) {
      time.jogadores.push(jogadoresMeioSemPrioridadeEmbaralhados[indexMeioSemPrioridade++]);
    }
  }
  
  // Reordenar os jogadores em cada time para seguir o padrão solicitado:
  // 1 bom, 1 ruim, 1 bom, 1 ruim, seguido pelo restante
  times.forEach(time => {
    if (time.jogadores.length === 0) return;
    
    // Ordenar jogadores do time por nível (do melhor para o pior)
    const jogadoresOrdenados = [...time.jogadores].sort((a, b) => b.geral - a.geral);
    
    // Pegar os 2 melhores e os 2 piores do time
    const melhores = jogadoresOrdenados.slice(0, Math.min(2, jogadoresOrdenados.length));
    const piores = jogadoresOrdenados.slice(-Math.min(2, jogadoresOrdenados.length));
    
    // Remover esses jogadores da lista
    const restantes = jogadoresOrdenados.filter(j => 
      !melhores.some(m => m.id === j.id) && 
      !piores.some(p => p.id === j.id)
    );
    
    // Criar a nova ordem: bom, ruim, bom, ruim, restante...
    const novaOrdem = [];
    
    // Adicionar alternadamente bom/ruim
    for (let i = 0; i < Math.min(melhores.length, piores.length); i++) {
      if (i < melhores.length) novaOrdem.push(melhores[i]);
      if (i < piores.length) novaOrdem.push(piores[i]);
    }
    
    // Adicionar restantes de melhores/piores (caso um tenha mais elementos que o outro)
    if (melhores.length > piores.length) {
      novaOrdem.push(...melhores.slice(piores.length));
    } else if (piores.length > melhores.length) {
      novaOrdem.push(...piores.slice(melhores.length));
    }
    
    // Adicionar os restantes
    novaOrdem.push(...restantes);
    
    // Substituir a lista de jogadores do time
    time.jogadores = novaOrdem;
  });

  // Calcular a média de cada time
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

export const auheauehau = () => {
  const __uUz = "Digite a senha para salvar no histórico:";
  const __kLp = "Senha incorreta. Ação cancelada.";

  const __bTf = "RnV0RHJhZnQyMDI1";
  const __aXv = "V0S2V2aW4mWGFuZGU=";

  function __yxM(c) {
    return c.split("").reverse().join("");
  }

  function __qwe(s) {
    return decodeURIComponent(
      atob(s)
        .split("")
        .map(function (x) {
          return "%" + ("00" + x.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  }

  const _pw = prompt(__uUz);

  const __zXp = __bTf + __yxM(__aXv);

  if (_pw !== __qwe(__zXp)) {
    alert(__kLp);
    return false;
  }

  return true;
};
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

  // Ordenar todos os jogadores por nivel geral (do melhor para o pior)
  const jogadoresOrdenados = [...jogadores].sort((a, b) => b.geral - a.geral);
  
  // Selecionar o dobro de jogadores top e bottom necessários
  const topNecessarios = totalDeTimes; // 1 por time
  const bottomNecessarios = totalDeTimes; // 1 por time
  const topParaSelecao = topNecessarios * 2; // Dobro de tops
  const bottomParaSelecao = bottomNecessarios * 2; // Dobro de bottoms
  
  // Selecionar os N melhores e N piores jogadores
  const jogadoresTop = jogadoresOrdenados.slice(0, topParaSelecao);
  const jogadoresBottom = jogadoresOrdenados.slice(-bottomParaSelecao);
  
  // Embaralhar os jogadores top e bottom
  const jogadoresTopEmbaralhados = embaralharArray([...jogadoresTop]);
  const jogadoresBottomEmbaralhados = embaralharArray([...jogadoresBottom]);
  
  // Distribuir 1 top e 1 bottom para cada time
  for (let i = 0; i < totalDeTimes; i++) {
    // Adicionar 1 jogador top para este time
    times[i].jogadores.push(jogadoresTopEmbaralhados[i]);
    
    // Adicionar 1 jogador bottom para este time
    times[i].jogadores.push(jogadoresBottomEmbaralhados[i]);
  }

  // Identificar os jogadores já distribuídos
  const jogadoresDistribuidosIds = times.flatMap(time => 
    time.jogadores.map(jogador => jogador.id)
  );

  // Jogadores restantes incluem os top e bottom não escolhidos e os jogadores do meio
  const jogadoresRestantesParaDistribuir = jogadores.filter(j => 
    !jogadoresDistribuidosIds.includes(j.id)
  );
  
  // Separar os jogadores restantes com e sem prioridade
  const jogadoresRestantesComPrioridade = jogadoresRestantesParaDistribuir.filter(j => j.prioridade);
  const jogadoresRestantesSemPrioridade = jogadoresRestantesParaDistribuir.filter(j => !j.prioridade);
  
  // Embaralhar os jogadores restantes
  const jogadoresComPrioridadeEmbaralhados = embaralharArray([...jogadoresRestantesComPrioridade]);
  const jogadoresSemPrioridadeEmbaralhados = embaralharArray([...jogadoresRestantesSemPrioridade]);

  // Distribuir os jogadores restantes com prioridade para os times 1 e 2
  let indexJogadoresComPrioridade = 0;
  
  for (let i = 0; i < Math.min(2, totalDeTimes); i++) {
    while (times[i].jogadores.length < jogadoresPorTime && indexJogadoresComPrioridade < jogadoresComPrioridadeEmbaralhados.length) {
      times[i].jogadores.push(jogadoresComPrioridadeEmbaralhados[indexJogadoresComPrioridade++]);
    }
  }

  // Distribuir os jogadores sem prioridade para os times 3 em diante
  let indexJogadoresSemPrioridade = 0;
  
  for (let i = 2; i < totalDeTimes; i++) {
    const limitePorTime = (i === totalDeTimes - 1 && jogadoresRestantes > 0) ? 
      (jogadoresRestantes || jogadoresPorTime) : jogadoresPorTime;
    
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
    const limitePorTime = (i === totalDeTimes - 1 && jogadoresRestantes > 0) ? 
      (jogadoresRestantes || jogadoresPorTime) : jogadoresPorTime;
    
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
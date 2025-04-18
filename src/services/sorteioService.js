// src/services/sorteioService.js
import { collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from './firebase';

// Função para embaralhar array (algoritmo Fisher-Yates)
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
  // TODO: Corrigir quantidade de times e jogadores "extras"

  const numeroDeTimes = Math.floor(jogadores.length / jogadoresPorTime);
  const numeroDeCoringas = numeroDeTimes * 2;
  
  // Ordenar jogadores por geral (do melhor para o pior)
  const jogadoresOrdenados = [...jogadores].sort((a, b) => b.geral - a.geral);
  
  // Separar os melhores e os piores
  const top8 = jogadoresOrdenados.slice(0, numeroDeCoringas);
  const bottom8 = jogadoresOrdenados.slice(-numeroDeCoringas);
  
  // Embaralhar esses grupos
  const top8Embaralhados = embaralharArray(top8);
  const bottom8Embaralhados = embaralharArray(bottom8);
  
  // Os 16 jogadores intermediários
  const intermediarios = jogadoresOrdenados.slice(numeroDeCoringas, jogadoresOrdenados.length - numeroDeCoringas);
  const intermediariosEmbaralhados = embaralharArray(intermediarios);
  
  // Criar 4 times vazios
  const times = [
    { id: 1, nome: 'Time 1', jogadores: [], media: 0 },
    { id: 2, nome: 'Time 2', jogadores: [], media: 0 },
    { id: 3, nome: 'Time 3', jogadores: [], media: 0 },
    { id: 4, nome: 'Time 4', jogadores: [], media: 0 }
  ];
  
  // Distribuir 1 top e 1 bottom em cada time
  for (let i = 0; i < numeroDeTimes; i++) {
    times[i].jogadores.push(top8Embaralhados[i]);
    times[i].jogadores.push(bottom8Embaralhados[i]);
  }
  
  // Distribuir os tops restantes
  for (let i = numeroDeTimes; i < numeroDeCoringas; i++) {
    times[i-numeroDeTimes].jogadores.push(top8Embaralhados[i]);
  }
  
  // Distribuir os bottoms restantes
  for (let i = numeroDeTimes; i < numeroDeCoringas; i++) {
    times[i-numeroDeTimes].jogadores.push(bottom8Embaralhados[i]);
  }
  
  // Distribuir os jogadores intermediários
  for (let i = 0; i < intermediariosEmbaralhados.length; i++) {
    const timeIndex = i % numeroDeTimes;
    times[timeIndex].jogadores.push(intermediariosEmbaralhados[i]);
  }
  
  // Calcular a média de cada time
  times.forEach(time => {
    const somaGeral = time.jogadores.reduce((acc, jogador) => acc + jogador.geral, 0);
    time.media = Math.round(somaGeral / time.jogadores.length);
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

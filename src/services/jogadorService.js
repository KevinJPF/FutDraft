// src/services/jogadorService.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION_NAME = 'jogadores';

const PESOS_POR_POSICAO = {
  ATA: {
    chute: 3.0,
    velocidade: 2.0,
    drible: 1.6,
    fisico: 1.5,
    passe: 1.3,
    defesa: 0.6,
  },
  MEI: {
    passe: 3.0,
    drible: 2.5,
    velocidade: 1.8,
    chute: 1.0,
    defesa: 1.0,
    fisico: 0.7,
  },
  DEF: {
    defesa: 3.2,
    fisico: 2.3,
    passe: 1.7,
    velocidade: 1.5,
    chute: 0.8,
    drible: 0.5
  }
};

// Cálculo da média geral do jogador
export const calcularMediaGeral = (habilidades, posicao) => {
  const pesos = PESOS_POR_POSICAO[posicao] || {};

  let somaPonderada = 0;
  let totalPesos = 0;

  for (const [habilidade, valor] of Object.entries(habilidades)) {
    const peso = pesos[habilidade] || 1;
    somaPonderada += valor * peso;
    totalPesos += peso;
  }

  const overall = somaPonderada / totalPesos;
  return Math.round(overall);
};

// Cadastrar jogador
export const cadastrarJogador = async (jogador) => {
  try {
    // Adiciona o jogador ao Firestore
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      nome: jogador.nome,
      posicao: jogador.posicao,
      habilidades: jogador.habilidades,
      imagem: jogador.imagem, // URL da imagem fornecida pelo usuário
      geral: jogador.geral,
      createdAt: new Date()
    });
    
    return { id: docRef.id, ...jogador };
  } catch (error) {
    console.error("Erro ao cadastrar jogador:", error);
    throw error;
  }
};

// Listar jogadores ordenados por geral (melhor para pior)
export const listarJogadores = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("geral", "desc"));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Erro ao listar jogadores:", error);
    throw error;
  }
};

// Remover jogador
export const removerJogador = async (jogadorId) => {
  try {
    // Remover documento do Firestore
    await deleteDoc(doc(db, COLLECTION_NAME, jogadorId));
    return true;
  } catch (error) {
    console.error("Erro ao remover jogador:", error);
    throw error;
  }
};

// Atualizar jogador
export const atualizarJogador = async (jogadorId, dadosAtualizados) => {
  try {
    // Atualiza documento no Firestore
    await updateDoc(doc(db, COLLECTION_NAME, jogadorId), dadosAtualizados);
    return { id: jogadorId, ...dadosAtualizados };
  } catch (error) {
    console.error("Erro ao atualizar jogador:", error);
    throw error;
  }
};
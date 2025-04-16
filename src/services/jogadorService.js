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

// Cálculo da média geral do jogador
export const calcularMediaGeral = (habilidades) => {
  const valores = Object.values(habilidades);
  const soma = valores.reduce((acc, valor) => acc + parseInt(valor || 0), 0);
  return Math.round(soma / valores.length);
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
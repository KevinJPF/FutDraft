// Adicione esta função auxiliar em um arquivo src/utils/helpers.js
export const getFallbackImage = (posicao) => {
    // Retorna imagens específicas baseadas na posição
    switch(posicao) {
      case 'DEF': return 'https://via.placeholder.com/400/0d6efd/FFFFFF?text=Defesa';
      case 'MEIO': return 'https://via.placeholder.com/400/198754/FFFFFF?text=Meio';
      case 'ATA': return 'https://via.placeholder.com/400/dc3545/FFFFFF?text=Ataque';
      default: return 'https://via.placeholder.com/400/6c757d/FFFFFF?text=Jogador';
    }
  };
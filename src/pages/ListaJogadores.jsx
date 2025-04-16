// src/pages/ListaJogadores.jsx (continuação)
import React, { useState, useEffect } from "react";
import { Card, Badge, Spinner, Button, Modal, Alert } from "react-bootstrap";
import { listarJogadores, removerJogador } from "../services/jogadorService";

const ListaJogadores = () => {
  const [jogadores, setJogadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estado para modal de confirmação de exclusão
  const [showModal, setShowModal] = useState(false);
  const [jogadorParaExcluir, setJogadorParaExcluir] = useState(null);
  const [deletando, setDeletando] = useState(false);

  // Carregar jogadores
  const carregarJogadores = async () => {
    setLoading(true);
    setError("");

    try {
      const listaJogadores = await listarJogadores();
      setJogadores(listaJogadores);
    } catch (err) {
      setError("Falha ao carregar jogadores. Verifique sua conexão.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Carregar jogadores ao montar o componente
  useEffect(() => {
    carregarJogadores();
  }, []);

  // Função para solicitar exclusão
  const confirmarExclusao = (jogador) => {
    setJogadorParaExcluir(jogador);
    setShowModal(true);
  };

  // src/pages/ListaJogadores.jsx (trecho modificado)
  // Função para executar exclusão
  const excluirJogador = async () => {
    if (!jogadorParaExcluir) return;

    setDeletando(true);
    try {
      await removerJogador(jogadorParaExcluir.id);
      setShowModal(false);
      setJogadorParaExcluir(null);

      // Atualizar lista de jogadores
      carregarJogadores();
    } catch (err) {
      setError("Erro ao excluir jogador");
      console.error(err);
    } finally {
      setDeletando(false);
    }
  };

  // Placeholder image se o jogador não tiver foto
  const getPlayerImage = (jogador) => {
    return (
      jogador.imagem || "https://via.placeholder.com/400/400?text=Sem+Foto"
    );
  };
  // Cores baseadas no valor da habilidade (estilo FIFA)
  const getOverallColor = (valor) => {
    if (valor >= 85) return "#00a651"; // Verde escuro
    if (valor >= 75) return "#8dc63f"; // Verde claro
    if (valor >= 65) return "#ffc20e"; // Amarelo
    if (valor >= 50) return "#f7941d"; // Laranja
    return "#ed1c24"; // Vermelho
  };

  // Cor background da posição
  const getPosicaoClass = (posicao) => {
    return `position-badge position-${posicao}`;
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Carregando jogadores...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Jogadores ({jogadores.length})</h2>
        <Button variant="outline-primary" onClick={carregarJogadores} size="sm">
          <i className="bi bi-arrow-clockwise me-1"></i> Atualizar
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {jogadores.length === 0 && !loading && (
        <Alert variant="info">
          Nenhum jogador cadastrado. Adicione jogadores para poder realizar
          sorteios!
        </Alert>
      )}

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
        {jogadores.map((jogador) => (
          <div className="col" key={jogador.id}>
            <Card
              className={`player-card h-100 card-${
                jogador.geral >= 75 ? "gold" : "silver"
              }`}
            >
              <div className="player-img-container">
                <img
                  src={getPlayerImage(jogador)}
                  alt={jogador.nome}
                  className="player-img"
                />
              </div>

              <div
                className="overall-badge"
                style={{ backgroundColor: getOverallColor(jogador.geral) }}
              >
                {jogador.geral}
              </div>

              <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-start">
                  <div>
                    {jogador.nome}
                    <div className="mt-1">
                      <span className={getPosicaoClass(jogador.posicao)}>
                        {jogador.posicao}
                      </span>
                    </div>
                  </div>
                </Card.Title>

                <div className="mt-3">
                  <div className="row row-cols-2 g-2">
                    {jogador.habilidades &&
                      Object.entries(jogador.habilidades).map(
                        ([habilidade, valor]) => (
                          <div className="col" key={habilidade}>
                            <div className="d-flex justify-content-between">
                              <small className="text-capitalize">
                                {habilidade}
                              </small>
                              <small className="fw-bold">{valor}</small>
                            </div>
                            <div
                              className="stat-bar"
                              style={{
                                width: `${valor}%`,
                                backgroundColor: getOverallColor(valor),
                                maxWidth: "100%",
                              }}
                            ></div>
                          </div>
                        )
                      )}
                  </div>
                </div>
              </Card.Body>

              <Card.Footer className="text-center">
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => confirmarExclusao(jogador)}
                >
                  <i className="bi bi-trash"></i> Remover
                </Button>
              </Card.Footer>
            </Card>
          </div>
        ))}
      </div>

      {/* Modal de confirmação de exclusão */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {jogadorParaExcluir && (
            <p>
              Tem certeza que deseja excluir o jogador{" "}
              <strong>{jogadorParaExcluir.nome}</strong>? Esta ação não pode ser
              desfeita.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            disabled={deletando}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={excluirJogador}
            disabled={deletando}
          >
            {deletando ? "Excluindo..." : "Excluir"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListaJogadores;

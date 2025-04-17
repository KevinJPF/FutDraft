// src/pages/ListaJogadores.jsx (continuação)
import React, { useState, useEffect } from "react";
import { Card, Badge, Spinner, Button, Modal, Alert } from "react-bootstrap";
import {
  listarJogadores,
  removerJogador,
  calcularMediaGeral,
} from "../services/jogadorService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashCan } from "@fortawesome/free-regular-svg-icons";

const ListaJogadores = () => {
  const [jogadores, setJogadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estado para modal de confirmação de exclusão
  const [showModal, setShowModal] = useState(false);
  const [jogadorParaExcluir, setJogadorParaExcluir] = useState(null);
  const [deletando, setDeletando] = useState(false);

  const ordemHabilidades = [
    "velocidade",
    "chute",
    "passe",
    "drible",
    "defesa",
    "fisico",
  ];

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

      <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
        {jogadores.map((jogador, index) => (
          <div className="col" key={jogador.id}>
            <Card className={`player-card h-100 justify-content-end`}>
              <img
                src={`/public/${
                  jogador.geral >= 80
                    ? "gold-r"
                    : jogador.geral >= 75
                    ? "gold"
                    : jogador.geral >= 73
                    ? "silver-r"
                    : jogador.geral >= 65
                    ? "silver"
                    : jogador.geral >= 62
                    ? "bronze-r"
                    : "bronze"
                }.png`}
                alt=""
              />
              <div className={`col-12 card-content`}>
                <div className="player-img-container">
                  <div className="overall-position">
                    <div className="overall-badge">
                      {calcularMediaGeral(jogador.habilidades, jogador.posicao)}
                    </div>
                    <div className="position-badge">{jogador.posicao}</div>
                  </div>
                  <img
                    src={getPlayerImage(jogador)}
                    alt={jogador.nome}
                    className="player-img"
                  />
                </div>

                <div className="jogador-nome">{jogador.nome}</div>

                <div className="">
                  <div className="stats-container">
                    {jogador.habilidades &&
                      ordemHabilidades.map((habilidade) => (
                        <div className="stat-value" key={habilidade}>
                          {jogador.habilidades[habilidade]}
                        </div>
                      ))}
                  </div>
                </div>

                <div className="buttons-container">
                  <Button
                    variant="secondary rounded-circle"
                    size="sm"
                    onClick={() => alert("Editar")}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button
                    variant="danger rounded-circle"
                    size="sm"
                    onClick={() => confirmarExclusao(jogador)}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </Button>
                </div>
              </div>
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

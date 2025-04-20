// src/pages/SorteioTimes.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  Alert,
  Spinner,
  Tabs,
  Tab,
  Form,
  Modal,
  Row,
  Col,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { listarJogadores } from "../services/jogadorService";
import {
  sortearTimes,
  salvarSorteio,
  obterHistoricoSorteios,
} from "../services/sorteioService";
import * as htmlToImage from "html-to-image";

const SorteioTimes = () => {
  const [jogadores, setJogadores] = useState([]);
  const [jogadoresSelecionados, setJogadoresSelecionados] = useState([]);
  const [times, setTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sorteando, setSorteando] = useState(false);
  const [error, setError] = useState("");
  const [historico, setHistorico] = useState([]);
  const [carregandoHistorico, setCarregandoHistorico] = useState(false);
  const [activeTab, setActiveTab] = useState("atual");
  const [showModal, setShowModal] = useState(false);
  const [jogadoresPorTime, setJogadoresPorTime] = useState(6);
  const [salvarNoHistorico, setSalvarNoHistorico] = useState(false);
  const sorteioRef = useRef(null);

  // Carregar jogadores ao montar o componente
  useEffect(() => {
    carregarJogadores();
    carregarHistorico();
  }, []);

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

  // Carregar histórico
  const carregarHistorico = async () => {
    setCarregandoHistorico(true);

    try {
      const historicoSorteios = await obterHistoricoSorteios();
      setHistorico(historicoSorteios);
    } catch (err) {
      console.error("Erro ao carregar histórico:", err);
    } finally {
      setCarregandoHistorico(false);
    }
  };

  // Abrir modal para seleção de jogadores
  const abrirModalSelecaoJogadores = () => {
    // Preparar jogadores com propriedades para seleção
    const jogadoresComSelecao = jogadores.map((jogador) => ({
      ...jogador,
      participa: jogador.participa || true,
      prioridade: jogador.prioridade || true,
    }));

    setJogadoresSelecionados(jogadoresComSelecao);
    setShowModal(true);
  };

  // Atualizar participação de um jogador
  const toggleParticipacao = (id) => {
    setJogadoresSelecionados((prev) =>
      prev.map((jogador) => {
        if (jogador.id === id) {
          // Se estamos desativando a participação, também removemos a prioridade
          const participa = !jogador.participa;
          return {
            ...jogador,
            participa,
            prioridade: participa ? jogador.prioridade : false,
          };
        }
        return jogador;
      })
    );
  };

  // Atualizar prioridade de um jogador
  const togglePrioridade = (id) => {
    setJogadoresSelecionados((prev) =>
      prev.map((jogador) => {
        if (jogador.id === id) {
          return {
            ...jogador,
            prioridade: !jogador.prioridade,
          };
        }
        return jogador;
      })
    );
  };

  // Confirmar seleção de jogadores e realizar sorteio
  const confirmarSelecaoERealizarSorteio = () => {
    const jogadoresSorteio = jogadoresSelecionados.filter((j) => j.participa);
    setShowModal(false);
    executarSorteio(jogadoresSorteio);
  };

  // Executar sorteio
  const executarSorteio = async (jogadoresSorteio) => {
    setError("");
    setSorteando(true);

    try {
      const minimoJogadores = jogadoresPorTime * 2;
      if (jogadoresSorteio.length < minimoJogadores) {
        throw new Error(
          `É necessário ter pelo menos ${minimoJogadores} jogadores selecionados para realizar o sorteio`
        );
      }

      const timesSorteados = sortearTimes(jogadoresSorteio, jogadoresPorTime);
      setTimes(timesSorteados);

      // Salvar no Firebase se a opção estiver marcada
      if (salvarNoHistorico) {
        await salvarSorteio(timesSorteados);
        // Atualizar histórico
        await carregarHistorico();
      }

      // Mudar para a aba atual
      setActiveTab("atual");
    } catch (err) {
      setError(err.message || "Erro ao realizar sorteio");
      console.error(err);
    } finally {
      setSorteando(false);
    }
  };

  // Exportar sorteio como imagem
  const exportarComoImagem = async () => {
    if (!sorteioRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(sorteioRef.current, {
        quality: 0.95,
        backgroundColor: "white",
      });

      // Criar link para download
      const link = document.createElement("a");
      link.download = `sorteio-times-${
        new Date().toISOString().split("T")[0]
      }.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Erro ao exportar imagem:", err);
      alert("Erro ao gerar imagem. Tente novamente.");
    }
  };

  // Placeholder image se o jogador não tiver foto
  const getPlayerImage = (jogador) => {
    return jogador.imagem || "/api/placeholder/40/40";
  };

  // Formatar data
  const formatarData = (data) => {
    if (!data) return "";

    const d = new Date(data);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Cores baseadas no valor da habilidade (estilo FIFA)
  const getSkillColor = (valor) => {
    if (valor >= 80) return "#00a651"; // Verde escuro
    if (valor >= 70) return "#8dc63f"; // Verde claro
    if (valor >= 60) return "#ffc20e"; // Amarelo
    if (valor >= 40) return "#f7941d"; // Laranja
    return "#ed1c24"; // Vermelho
  };

  // Renderizar times sorteados
  const renderizarTimes = (timesList) => {
    if (!timesList || timesList.length === 0) return null;

    return (
      <div className="row row-cols-1 row-cols-sm-2 g-3" ref={sorteioRef}>
        {timesList.map((time) => (
          <div className="col" key={time.id}>
            <Card className={`team-card team-${time.id}`}>
              <div className="team-header">
                <div className="d-flex justify-content-between align-items-center">
                  <div>{time.nome}</div>
                  <div>Média: {time.media}</div>
                </div>
              </div>
              <Card.Body className="p-0">
                {time.jogadores.map((jogador, index) => (
                  <div className="team-player" key={jogador.id}>
                    <img
                      src={getPlayerImage(jogador)}
                      alt={jogador.nome}
                      className="team-player-img"
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <div>{`${jogador.nome} ${
                          index == 0 ? "🃏" : index == 1 ? "♦️" : "♟️"
                        }`}</div>
                        <div
                          className="badge"
                          style={{
                            backgroundColor: getSkillColor(jogador.geral),
                          }}
                        >
                          {jogador.geral}
                        </div>
                      </div>
                      <small
                        className={`position-badge position-${jogador.posicao}`}
                      >
                        {jogador.posicao}
                      </small>
                      {jogador.prioridade && (
                        <span className="ms-2 badge bg-info">Prioridade</span>
                      )}
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
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
      <h2 className="text-center mb-4">Sorteio de Times</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="mb-4">
        <Card>
          <Card.Body>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
              <div>
                <h5 className="mb-2 mb-md-0">
                  Jogadores disponíveis: {jogadores.length}
                </h5>
              </div>

              <div className="d-flex flex-wrap gap-2 align-items-center">
                <DropdownButton
                  id="dropdown-jogadores-por-time"
                  title={`${jogadoresPorTime} jogadores por time`}
                  variant="outline-secondary"
                >
                  {[4, 5, 6, 7].map((num) => (
                    <Dropdown.Item
                      key={num}
                      onClick={() => setJogadoresPorTime(num)}
                      active={jogadoresPorTime === num}
                    >
                      {num} jogadores por time
                    </Dropdown.Item>
                  ))}
                </DropdownButton>

                <Form.Check
                  type="checkbox"
                  id="salvar-historico"
                  label="Salvar no histórico"
                  checked={salvarNoHistorico}
                  onChange={(e) => {
                    if (salvarNoHistorico) {
                      setSalvarNoHistorico(false);
                      return;
                    }

                    const senha = prompt(
                      "Digite a senha para confirmar o salvamento:"
                    );

                    if (senha === "salvaaemano") {
                      setSalvarNoHistorico(true);
                    } else {
                      alert("Senha incorreta. Ação cancelada.");
                    }
                  }}
                  className="mx-2"
                />

                <Button
                  variant="outline-primary"
                  onClick={carregarJogadores}
                  disabled={sorteando}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i> Atualizar
                </Button>

                <Button
                  variant="primary"
                  onClick={abrirModalSelecaoJogadores}
                  disabled={
                    sorteando || jogadores.length < jogadoresPorTime * 2
                  }
                >
                  <i className="bi bi-shuffle me-2"></i>
                  Sortear Times
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Modal de Seleção de Jogadores */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Selecionar Jogadores para o Sorteio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            Selecione os jogadores que participarão do sorteio e defina quais
            têm prioridade. Jogadores com prioridade serão alocados nos times 1
            e 2.
          </Alert>

          <div className="mb-3">
            <Row className="mb-2 fw-bold border-bottom pb-2">
              <Col xs={6}>Nome do Jogador</Col>
              <Col xs={2} className="text-center">
                Geral
              </Col>
              <Col xs={2} className="text-center">
                Participa
              </Col>
              <Col xs={2} className="text-center">
                Prioridade
              </Col>
            </Row>

            {jogadoresSelecionados.map((jogador) => (
              <Row
                key={jogador.id}
                className="mb-2 align-items-center py-1 border-bottom"
              >
                <Col xs={6}>
                  <div className="d-flex align-items-center">
                    <img
                      src={getPlayerImage(jogador)}
                      alt={jogador.nome}
                      className="me-2"
                      width="30"
                      height="30"
                    />
                    {jogador.nome}
                  </div>
                </Col>
                <Col xs={2} className="text-center">
                  <span
                    className="badge"
                    style={{
                      backgroundColor: getSkillColor(jogador.geral),
                    }}
                  >
                    {jogador.geral}
                  </span>
                </Col>
                <Col xs={2} className="text-center">
                  <Form.Check
                    type="checkbox"
                    checked={jogador.participa}
                    onChange={() => toggleParticipacao(jogador.id)}
                    id={`participa-${jogador.id}`}
                  />
                </Col>
                <Col xs={2} className="text-center">
                  <Form.Check
                    type="checkbox"
                    checked={jogador.prioridade}
                    onChange={() => togglePrioridade(jogador.id)}
                    disabled={!jogador.participa}
                    id={`prioridade-${jogador.id}`}
                  />
                </Col>
              </Row>
            ))}
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <div>
              Jogadores selecionados:{" "}
              {jogadoresSelecionados.filter((j) => j.participa).length}
            </div>
            <div>Mínimo necessário: {jogadoresPorTime * 2} jogadores</div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={confirmarSelecaoERealizarSorteio}
            disabled={
              jogadoresSelecionados.filter((j) => j.participa).length <
              jogadoresPorTime * 2
            }
          >
            Sortear com Jogadores Selecionados
          </Button>
        </Modal.Footer>
      </Modal>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="atual" title="Sorteio Atual">
          {times.length > 0 ? (
            <div>
              <div className="d-flex justify-content-end mb-3">
                <Button
                  variant="success"
                  onClick={exportarComoImagem}
                  size="sm"
                >
                  <i className="bi bi-download me-1"></i> Exportar para WhatsApp
                </Button>
              </div>
              {renderizarTimes(times)}
            </div>
          ) : (
            <Alert variant="info">
              Nenhum sorteio realizado ainda. Clique em "Sortear Times" para
              iniciar!
            </Alert>
          )}
        </Tab>

        <Tab eventKey="historico" title="Histórico de Sorteios">
          {carregandoHistorico ? (
            <div className="text-center my-4">
              <Spinner animation="border" variant="primary" size="sm" />
              <p className="mt-2">Carregando histórico...</p>
            </div>
          ) : historico.length > 0 ? (
            <div>
              {historico.map((sorteio, index) => (
                <div key={sorteio.id} className="mb-4">
                  <h5 className="border-bottom py-2 px-2 bg-dark rounded-1">
                    Sorteio {index + 1} - {formatarData(sorteio.data)}
                  </h5>
                  {renderizarTimes(sorteio.times)}
                </div>
              ))}
            </div>
          ) : (
            <Alert variant="info">
              Nenhum histórico de sorteio encontrado.
            </Alert>
          )}
        </Tab>
      </Tabs>
    </div>
  );
};

export default SorteioTimes;

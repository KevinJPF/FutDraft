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
  Container,
} from "react-bootstrap";
import { aUHXaHEz } from "../utils/opaEIw";
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
        backgroundColor: "#121212",
      });

      // Criar link para download
      const link = document.createElement("a");
      link.download = `sorteio-times-${
        new Date().toISOString().split("T")[0]
      }.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      setError("Erro ao exportar imagem");
      console.error(err);
    }
  };

  // Renderizar jogador no modal de seleção
  const renderJogadorSelecao = (jogador) => {
    const { id, nome, posicao, geral, imagem, participa, prioridade } = jogador;
    const getPlayerImage = (url) => {
      return url || "https://via.placeholder.com/150?text=Sem+Foto";
    };

    return (
      <div
        key={id}
        className={`d-flex align-items-center p-2 my-1 rounded ${
          participa ? "bg-dark" : "bg-secondary bg-opacity-25"
        }`}
      >
        <div className="form-check form-switch me-2">
          <input
            className="form-check-input"
            type="checkbox"
            checked={participa}
            onChange={() => toggleParticipacao(id)}
            id={`participa-${id}`}
          />
        </div>

        <img
          src={getPlayerImage(imagem)}
          alt={nome}
          className="rounded-circle"
          style={{ width: "36px", height: "36px", objectFit: "cover" }}
        />

        <div className="ms-3 flex-grow-1">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <span className="fw-bold">{nome}</span>
              <span className={`ms-2 badge position-${posicao}`}>
                {posicao}
              </span>
            </div>
            <span
              className="badge"
              style={{
                backgroundColor:
                  geral >= 80
                    ? "#00a651"
                    : geral >= 70
                    ? "#8dc63f"
                    : geral >= 60
                    ? "#ffc20e"
                    : geral >= 40
                    ? "#f7941d"
                    : "#ed1c24",
              }}
            >
              {geral}
            </span>
          </div>
        </div>

        {participa && (
          <div className="form-check ms-2">
            <input
              className="form-check-input"
              type="checkbox"
              checked={prioridade}
              onChange={() => togglePrioridade(id)}
              id={`prioridade-${id}`}
            />
            <label className="form-check-label" htmlFor={`prioridade-${id}`}>
              Prioridade
            </label>
          </div>
        )}
      </div>
    );
  };

  // Renderizar times sorteados
  const renderTimesSorteados = () => {
    if (!times.length) {
      return (
        <div className="text-center my-5">
          <p>Nenhum sorteio realizado ainda.</p>
          <Button
            variant="outline-primary"
            onClick={abrirModalSelecaoJogadores}
            className="mt-3 px-4 py-2"
          >
            Realizar Sorteio
          </Button>
        </div>
      );
    }

    return (
      <div>
        <div className="d-flex justify-content-between mb-4">
          <h3 className="mb-0">Times Sorteados</h3>
          <div>
            <Button
              variant="outline-primary"
              onClick={exportarComoImagem}
              className="me-2"
            >
              <i className="bi bi-download me-1"></i> Baixar Imagem
            </Button>
            <Button variant="primary" onClick={abrirModalSelecaoJogadores}>
              Novo Sorteio
            </Button>
          </div>
        </div>

        <div ref={sorteioRef} className="p-3 rounded">
          <div className="row">
            {times.map((time, index) => (
              <div key={index} className={`col-md-6 mb-4`}>
                <div className={`team-card team-${index + 1}`}>
                  <div className="team-header">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>{time.nome}</div>
                      <div
                        className="ms-2 badge"
                        style={{
                          backgroundColor:
                            time.media >= 80
                              ? "#00a651"
                              : time.media >= 70
                              ? "#8dc63f"
                              : time.media >= 60
                              ? "#ffc20e"
                              : time.media >= 40
                              ? "#f7941d"
                              : "#ed1c24",
                        }}
                      >
                        {time.media}
                      </div>
                    </div>
                  </div>
                  <div className="p-0">
                    {time.jogadores.map((jogador, index) => (
                      <div key={jogador.id} className="team-player">
                        <img
                          src={
                            jogador.imagem ||
                            "https://via.placeholder.com/40?text=?"
                          }
                          alt={jogador.nome}
                          className="team-player-img"
                        />
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-center">
                            <span
                              className="fw-bold text-truncate"
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                display: "inline-block",
                              }}
                            >
                              {`${
                                index === 0 ? "🦄" : index === 1 ? "🦊" : "🦝"
                              } ${jogador.nome}`}
                            </span>

                            <div className="flex-shrink-0">
                              <span className={`badge`}>
                                {jogador.prioridade ? "⚽" : ""}
                              </span>
                              <span
                                className={`badge position-${jogador.posicao}`}
                              >
                                {jogador.posicao}
                              </span>
                              <span
                                className="ms-2 badge"
                                style={{
                                  backgroundColor:
                                    jogador.geral >= 80
                                      ? "#00a651"
                                      : jogador.geral >= 70
                                      ? "#8dc63f"
                                      : jogador.geral >= 60
                                      ? "#ffc20e"
                                      : jogador.geral >= 40
                                      ? "#f7941d"
                                      : "#ed1c24",
                                }}
                              >
                                {jogador.geral}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Renderizar histórico de sorteios
  const renderHistoricoSorteios = () => {
    if (carregandoHistorico) {
      return (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Carregando histórico...</p>
        </div>
      );
    }

    if (!historico.length) {
      return (
        <Alert variant="info" className="my-4">
          Nenhum sorteio salvo no histórico.
        </Alert>
      );
    }

    return (
      <div className="accordion" id="historicoSorteios">
        {historico.map((item, index) => (
          <div
            className="accordion-item bg-dark mb-3 border border-secondary"
            key={index}
          >
            <h2 className="accordion-header" id={`heading-${index}`}>
              <button
                className="accordion-button collapsed bg-dark text-light"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse-${index}`}
                aria-expanded="false"
                aria-controls={`collapse-${index}`}
              >
                <div className="d-flex justify-content-between w-100 align-items-center">
                  <span>
                    Sorteio {index + 1} - {formatarData(Date(item.data))}
                  </span>
                  <span className="badge bg-primary ms-2">
                    {item.times.length} Times
                  </span>
                </div>
              </button>
            </h2>
            <div
              id={`collapse-${index}`}
              className="accordion-collapse collapse"
              aria-labelledby={`heading-${index}`}
              data-bs-parent="#historicoSorteios"
            >
              <div className="accordion-body p-3">
                <div className="row">
                  {item.times.map((time, timeIndex) => (
                    <div key={timeIndex} className="col-md-6 mb-3">
                      <div className={`team-card team-${timeIndex + 1}`}>
                        <div className="team-header">
                          <h5 className="mb-0">Time {timeIndex + 1}</h5>
                        </div>
                        <div className="p-0">
                          {time.jogadores.map((jogador, index) => (
                            <div key={jogador.id} className="team-player">
                              <img
                                src={
                                  jogador.imagem ||
                                  "https://via.placeholder.com/40?text=?"
                                }
                                alt={jogador.nome}
                                className="team-player-img"
                              />
                              <div className="flex-grow-1">
                                <div className="d-flex justify-content-between align-items-center">
                                  {`${
                                    index === 0
                                      ? "🦄"
                                      : index === 1
                                      ? "🦊"
                                      : "🦝"
                                  } ${jogador.nome}`}
                                  <div>
                                    <span
                                      className={`ms-2 badge position-${jogador.posicao}`}
                                    >
                                      {jogador.posicao}
                                    </span>
                                    <span
                                      className="ms-2 badge"
                                      style={{
                                        backgroundColor:
                                          jogador.geral >= 80
                                            ? "#00a651"
                                            : jogador.geral >= 70
                                            ? "#8dc63f"
                                            : jogador.geral >= 60
                                            ? "#ffc20e"
                                            : jogador.geral >= 40
                                            ? "#f7941d"
                                            : "#ed1c24",
                                      }}
                                    >
                                      {jogador.geral}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
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

  if (loading) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner
          animation="border"
          className="mb-3"
          style={{ width: "3rem", height: "3rem", borderWidth: "0.25rem" }}
        />
        <p className="text-center text-secondary">Carregando jogadores...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">
        <span style={{ color: "#39ff14" }}>Sorteio</span> de Times
      </h2>

      {error && (
        <Alert variant="danger" className="mb-4 shadow-sm">
          {error}
        </Alert>
      )}

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="atual" title="Sorteio Atual">
          {renderTimesSorteados()}
        </Tab>
        <Tab eventKey="historico" title="Histórico">
          {renderHistoricoSorteios()}
        </Tab>
      </Tabs>

      {/* Modal de seleção de jogadores */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Selecionar Jogadores para o Sorteio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Jogadores por Time</Form.Label>
              <div className="d-flex align-items-center gap-3">
                <Form.Range
                  min={2}
                  max={11}
                  value={jogadoresPorTime}
                  onChange={(e) =>
                    setJogadoresPorTime(parseInt(e.target.value))
                  }
                  className="flex-grow-1"
                />
                <div
                  className="badge bg-primary rounded-pill px-3 py-2"
                  style={{ minWidth: "42px", fontSize: "1rem" }}
                >
                  {jogadoresPorTime}
                </div>
              </div>
            </Form.Group>

            <div className="d-flex justify-content-between mb-3">
              <Form.Check
                type="switch"
                id="salvar-historico"
                label="Salvar este sorteio no histórico"
                checked={salvarNoHistorico}
                onChange={(e) => {
                  if (!salvarNoHistorico && !aUHXaHEz()) {
                    return;
                  }
                  setSalvarNoHistorico(e.target.checked);
                }}
              />

              <div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    setJogadoresSelecionados((prev) =>
                      prev.map((j) => ({ ...j, participa: true }))
                    );
                  }}
                  className="me-2"
                >
                  Selecionar Todos
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => {
                    setJogadoresSelecionados((prev) =>
                      prev.map((j) => ({ ...j, participa: false }))
                    );
                  }}
                >
                  Limpar Seleção
                </Button>
              </div>
            </div>

            <div
              className="selecao-jogadores mt-3"
              style={{ maxHeight: "50vh", overflowY: "auto" }}
            >
              {jogadoresSelecionados.map(renderJogadorSelecao)}
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={confirmarSelecaoERealizarSorteio}
            disabled={sorteando}
          >
            {sorteando ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Sorteando...
              </>
            ) : (
              "Sortear Times"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SorteioTimes;

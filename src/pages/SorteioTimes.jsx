// src/pages/SorteioTimes.jsx
import React, { useState, useEffect, useRef } from "react";
import { Button, Card, Alert, Spinner, Tabs, Tab } from "react-bootstrap";
import { listarJogadores } from "../services/jogadorService";
import {
  sortearTimes,
  salvarSorteio,
  obterHistoricoSorteios,
} from "../services/sorteioService";
import * as htmlToImage from "html-to-image";

const SorteioTimes = () => {
  const [jogadores, setJogadores] = useState([]);
  const [times, setTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sorteando, setSorteando] = useState(false);
  const [error, setError] = useState("");
  const [historico, setHistorico] = useState([]);
  const [carregandoHistorico, setCarregandoHistorico] = useState(false);
  const [activeTab, setActiveTab] = useState("atual");
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

  // Realizar sorteio
  const realizarSorteio = async () => {
    setError("");
    setSorteando(true);

    try {
      if (jogadores.length < 24) {
        throw new Error(
          "É necessário ter pelo menos 24 jogadores cadastrados para realizar o sorteio"
        );
      }

      const timesSorteados = sortearTimes(jogadores);
      setTimes(timesSorteados);

      // Salvar no Firebase
      await salvarSorteio(timesSorteados);

      // Atualizar histórico
      await carregarHistorico();

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
                {time.jogadores.map((jogador) => (
                  <div className="team-player" key={jogador.id}>
                    <img
                      src={getPlayerImage(jogador)}
                      alt={jogador.nome}
                      className="team-player-img"
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <div>{jogador.nome}</div>
                        <div className="badge bg-secondary">
                          {jogador.geral}
                        </div>
                      </div>
                      <small
                        className={`position-badge position-${jogador.posicao}`}
                      >
                        {jogador.posicao}
                      </small>
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
                <h5 className="mb-0">
                  Jogadores disponíveis: {jogadores.length}
                </h5>
                <small className="text-muted">
                  Necessário pelo menos 24 jogadores
                </small>
              </div>

              <div className="d-flex gap-2">
                <Button
                  variant="outline-primary"
                  onClick={carregarJogadores}
                  disabled={sorteando}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i> Atualizar
                </Button>

                <Button
                  variant="primary"
                  onClick={realizarSorteio}
                  disabled={sorteando || jogadores.length < 24}
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
                    <>
                      <i className="bi bi-shuffle me-2"></i>
                      Sortear Times
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

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
                  <h5 className="border-bottom pb-2">
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

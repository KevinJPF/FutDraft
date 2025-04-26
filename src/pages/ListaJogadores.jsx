// src/pages/ListaJogadores.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  Badge,
  Spinner,
  Button,
  Modal,
  Alert,
  Form,
  Row,
  Col,
  InputGroup,
  Dropdown,
} from "react-bootstrap";
import {
  listarJogadores,
  removerJogador,
  calcularMediaGeral,
} from "../services/jogadorService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrashCan,
  faSort,
  faSortUp,
  faSortDown,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import gold from "/gold.png";
import gold_r from "/gold-r.png";
import silver from "/silver.png";
import silver_r from "/silver-r.png";
import bronze from "/bronze.png";
import bronze_r from "/bronze-r.png";

const ListaJogadores = () => {
  const [jogadores, setJogadores] = useState([]);
  const [jogadoresFiltrados, setJogadoresFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estado para modal de confirmação de exclusão
  const [showModal, setShowModal] = useState(false);
  const [jogadorParaExcluir, setJogadorParaExcluir] = useState(null);
  const [deletando, setDeletando] = useState(false);

  // Estados para filtros e ordenação
  const [termoBusca, setTermoBusca] = useState("");
  const [posicaoFiltro, setPosicaoFiltro] = useState("");
  const [filtroGeral, setFiltroGeral] = useState({ min: 0, max: 99 });
  const [ordenacao, setOrdenacao] = useState({ campo: "geral", tipo: "desc" });
  const [showFiltrosAvancados, setShowFiltrosAvancados] = useState(false);
  const [filtrosHabilidades, setFiltrosHabilidades] = useState({
    velocidade: { min: 0, max: 99 },
    chute: { min: 0, max: 99 },
    passe: { min: 0, max: 99 },
    drible: { min: 0, max: 99 },
    defesa: { min: 0, max: 99 },
    fisico: { min: 0, max: 99 },
  });

  const ordemHabilidades = [
    "velocidade",
    "chute",
    "passe",
    "drible",
    "defesa",
    "fisico",
  ];

  const posicoesDisponiveis = ["DEF", "MEI", "ATA"];

  // Carregar jogadores
  const carregarJogadores = async () => {
    setLoading(true);
    setError("");

    try {
      const listaJogadores = await listarJogadores();
      setJogadores(listaJogadores);
      aplicarFiltrosEOrdenacao(listaJogadores);
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

  // Aplicar filtros e ordenação quando qualquer critério mudar
  useEffect(() => {
    aplicarFiltrosEOrdenacao(jogadores);
  }, [termoBusca, posicaoFiltro, filtroGeral, ordenacao, filtrosHabilidades]);

  // Função para aplicar todos os filtros e ordenação
  const aplicarFiltrosEOrdenacao = (lista) => {
    if (!lista || !lista.length) {
      setJogadoresFiltrados([]);
      return;
    }

    // Aplicar filtros
    let resultados = lista.filter((jogador) => {
      // Filtro por nome
      const nomeMatcha = jogador.nome
        .toLowerCase()
        .includes(termoBusca.toLowerCase());

      // Filtro por posição
      const posicaoMatcha =
        posicaoFiltro === "" || jogador.posicao === posicaoFiltro;

      // Filtro por geral
      const geralMatcha =
        jogador.geral >= filtroGeral.min && jogador.geral <= filtroGeral.max;

      // Filtro por habilidades
      const habilidadesMatcham = ordemHabilidades.every((hab) => {
        const valor = jogador.habilidades?.[hab] || 0;
        return (
          valor >= filtrosHabilidades[hab].min &&
          valor <= filtrosHabilidades[hab].max
        );
      });

      return nomeMatcha && posicaoMatcha && geralMatcha && habilidadesMatcham;
    });

    // Aplicar ordenação
    resultados.sort((a, b) => {
      const { campo, tipo } = ordenacao;
      let valorA, valorB;

      if (campo === "nome") {
        valorA = a.nome.toLowerCase();
        valorB = b.nome.toLowerCase();
      } else if (campo === "geral") {
        valorA = a.geral;
        valorB = b.geral;
      } else if (campo === "posicao") {
        valorA = a.posicao;
        valorB = b.posicao;
      } else if (ordemHabilidades.includes(campo)) {
        valorA = a.habilidades?.[campo] || 0;
        valorB = b.habilidades?.[campo] || 0;
      }

      if (tipo === "asc") {
        return valorA > valorB ? 1 : valorA < valorB ? -1 : 0;
      } else {
        return valorA < valorB ? 1 : valorA > valorB ? -1 : 0;
      }
    });

    setJogadoresFiltrados(resultados);
  };

  // Alterar ordenação
  const alterarOrdenacao = (campo) => {
    if (ordenacao.campo === campo) {
      // Se já estamos ordenando por este campo, invertemos a direção
      setOrdenacao({
        campo,
        tipo: ordenacao.tipo === "asc" ? "desc" : "asc",
      });
    } else {
      // Caso contrário, definimos o novo campo e começamos com ascendente
      setOrdenacao({
        campo,
        tipo: "desc",
      });
    }
  };

  // Resetar todos os filtros
  const resetarFiltros = () => {
    setTermoBusca("");
    setPosicaoFiltro("");
    setFiltroGeral({ min: 0, max: 99 });
    setOrdenacao({ campo: "geral", tipo: "desc" });

    const habilidadesReseted = {};
    ordemHabilidades.forEach((hab) => {
      habilidadesReseted[hab] = { min: 0, max: 99 };
    });

    setFiltrosHabilidades(habilidadesReseted);
    setShowFiltrosAvancados(false);
  };

  // Função para solicitar exclusão
  const confirmarExclusao = (jogador) => {
    setJogadorParaExcluir(jogador);
    setShowModal(true);
  };

  const handleDelete = (item) => {
    const senha = prompt("Digite a senha para confirmar a exclusão:");

    if (senha === "Kevinho&Xande2025") {
      // Aqui você chama sua função de exclusão
      confirmarExclusao(item);
    } else {
      alert("Senha incorreta. Ação cancelada.");
    }
  };

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

  // Traduzir nome da habilidade para português
  const traduzirHabilidade = (habilidade) => {
    const traducoes = {
      velocidade: "VEL",
      chute: "CHU",
      passe: "PAS",
      drible: "DRI",
      defesa: "DEF",
      fisico: "FIS",
    };

    return traducoes[habilidade] || habilidade;
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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>
          Jogadores ({jogadoresFiltrados.length} de {jogadores.length})
        </h2>
        <Button variant="outline-primary" onClick={carregarJogadores} size="sm">
          <i className="bi bi-arrow-clockwise me-1"></i> Atualizar
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Barra de pesquisa e filtros básicos */}
      <Card className="mb-4 border-0 bg-transparent">
        <Card.Body className="p-3 bg-dark rounded">
          <Row className="align-items-end">
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label>Buscar por nome</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite um nome..."
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  className="bg-darker border-secondary text-white"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-2">
                <Form.Label>Posição</Form.Label>
                <Form.Select
                  value={posicaoFiltro}
                  onChange={(e) => setPosicaoFiltro(e.target.value)}
                  className="bg-darker border-secondary text-white"
                >
                  <option value="">Todas</option>
                  {posicoesDisponiveis.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-2">
                <Form.Label>
                  Geral (OVR) entre {filtroGeral.min}-{filtroGeral.max}
                </Form.Label>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="number"
                    min="0"
                    max="99"
                    value={filtroGeral.min}
                    onChange={(e) =>
                      setFiltroGeral({
                        ...filtroGeral,
                        min: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="bg-darker border-secondary text-white"
                  />
                  <Form.Control
                    type="number"
                    min="0"
                    max="99"
                    value={filtroGeral.max}
                    onChange={(e) =>
                      setFiltroGeral({
                        ...filtroGeral,
                        max: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="bg-darker border-secondary text-white"
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex justify-content-end gap-2">
              <Button variant="outline-danger" onClick={resetarFiltros}>
                Limpar
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Barra de ordenação */}
      <div className="d-flex flex-wrap gap-2 mb-4 p-3 bg-dark rounded">
        <div className="me-2 align-self-center text-primary">
          <strong>Ordenar por:</strong>
        </div>
        <Button
          variant={ordenacao.campo === "geral" ? "primary" : "outline-primary"}
          size="sm"
          onClick={() => alterarOrdenacao("geral")}
          className={
            ordenacao.campo === "geral" ? "text-dark fw-bold" : "text-white"
          }
        >
          OVR{" "}
          {ordenacao.campo === "geral" &&
            (ordenacao.tipo === "asc" ? "↑" : "↓")}
        </Button>
        <Button
          variant={ordenacao.campo === "nome" ? "primary" : "outline-primary"}
          size="sm"
          onClick={() => alterarOrdenacao("nome")}
          className={
            ordenacao.campo === "nome" ? "text-dark fw-bold" : "text-white"
          }
        >
          Nome{" "}
          {ordenacao.campo === "nome" && (ordenacao.tipo === "asc" ? "↑" : "↓")}
        </Button>
        <Button
          variant={
            ordenacao.campo === "posicao" ? "primary" : "outline-primary"
          }
          size="sm"
          onClick={() => alterarOrdenacao("posicao")}
          className={
            ordenacao.campo === "posicao" ? "text-dark fw-bold" : "text-white"
          }
        >
          Posição{" "}
          {ordenacao.campo === "posicao" &&
            (ordenacao.tipo === "asc" ? "↑" : "↓")}
        </Button>

        {ordemHabilidades.map((hab) => (
          <Button
            key={hab}
            variant={ordenacao.campo === hab ? "primary" : "outline-primary"}
            size="sm"
            onClick={() => alterarOrdenacao(hab)}
            className={
              ordenacao.campo === hab ? "text-dark fw-bold" : "text-white"
            }
          >
            {traduzirHabilidade(hab)}{" "}
            {ordenacao.campo === hab && (ordenacao.tipo === "asc" ? "↑" : "↓")}
          </Button>
        ))}
      </div>

      {jogadoresFiltrados.length === 0 && !loading && (
        <Alert variant="info">
          {jogadores.length === 0
            ? "Nenhum jogador cadastrado. Adicione jogadores para poder realizar sorteios!"
            : "Nenhum jogador encontrado com os filtros selecionados."}
        </Alert>
      )}

      <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
        {jogadoresFiltrados.map((jogador) => (
          <div className="col" key={jogador.id}>
            <Card className={`player-card h-100 justify-content-end`}>
              <img
                src={
                  jogador.geral >= 80
                    ? gold_r
                    : jogador.geral >= 75
                    ? gold
                    : jogador.geral >= 73
                    ? silver_r
                    : jogador.geral >= 65
                    ? silver
                    : jogador.geral >= 62
                    ? bronze_r
                    : bronze
                }
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
                    onClick={() =>
                      alert("Funcionalidade em desenvolvimento...")
                    }
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button
                    variant="danger rounded-circle"
                    size="sm"
                    onClick={() => handleDelete(jogador)}
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

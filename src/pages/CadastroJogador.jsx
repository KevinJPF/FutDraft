// src/pages/CadastroJogador.jsx
import React, { useState } from "react";
import { Form, Button, Card, ProgressBar, Alert, Image } from "react-bootstrap";
import {
  cadastrarJogador,
  calcularMediaGeral,
} from "../services/jogadorService";

const CadastroJogador = () => {
  const [jogador, setJogador] = useState({
    nome: "",
    posicao: "DEF",
    imagem: "", // URL da imagem
    habilidades: {
      velocidade: 50,
      chute: 50,
      passe: 50,
      drible: 50,
      defesa: 50,
      fisico: 50,
    },
    geral: 50,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle de mudança nos campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;

    const novoGeral = calcularMediaGeral(jogador.habilidades, value);

    setJogador((prev) => ({
      ...prev,
      geral: novoGeral,
      [name]: value,
    }));
  };

  // Handle de mudança nas habilidades
  const handleHabilidadeChange = (e) => {
    const { name, value } = e.target;
    const novasHabilidades = {
      ...jogador.habilidades,
      [name]: parseInt(value),
    };

    const novoGeral = calcularMediaGeral(novasHabilidades, jogador.posicao);

    setJogador((prev) => ({
      ...prev,
      habilidades: novasHabilidades,
      geral: novoGeral,
    }));
  };

  // Submit do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!jogador.nome.trim()) {
        throw new Error("O nome do jogador é obrigatório");
      }

      await cadastrarJogador(jogador);

      // Resetar formulário
      setJogador({
        nome: "",
        posicao: "MEI",
        imagem: "",
        habilidades: {
          velocidade: 50,
          chute: 50,
          passe: 50,
          drible: 50,
          defesa: 50,
          fisico: 50,
        },
        geral: 50,
      });
      setSuccess("Jogador cadastrado com sucesso!");

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Erro ao cadastrar jogador");
    } finally {
      setLoading(false);
    }
  };

  // Cores baseadas no valor da habilidade (estilo FIFA)
  const getSkillColor = (valor) => {
    if (valor >= 85) return "#00a651"; // Verde escuro
    if (valor >= 70) return "#8dc63f"; // Verde claro
    if (valor >= 60) return "#ffc20e"; // Amarelo
    if (valor >= 40) return "#f7941d"; // Laranja
    return "#ed1c24"; // Vermelho
  };

  // Cor do overall (estilo FIFA)
  const getOverallColor = (valor) => {
    if (valor >= 85) return "#00a651"; // Verde escuro
    if (valor >= 75) return "#8dc63f"; // Verde claro
    if (valor >= 65) return "#ffc20e"; // Amarelo
    if (valor >= 50) return "#f7941d"; // Laranja
    return "#ed1c24"; // Vermelho
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-10 col-lg-8">
        <h2 className="text-center mb-4">Cadastrar Jogador</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Card className="shadow">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <div className="row">
                {/* Coluna de dados básicos */}
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Nome do Jogador</Form.Label>
                    <Form.Control
                      type="text"
                      name="nome"
                      value={jogador.nome}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Posição</Form.Label>
                    <Form.Select
                      name="posicao"
                      value={jogador.posicao}
                      onChange={handleChange}
                    >
                      <option value="DEF">Defesa</option>
                      <option value="MEI">Meia</option>
                      <option value="ATA">Ataque</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>URL da Foto do Jogador</Form.Label>
                    <Form.Control
                      type="url"
                      name="imagem"
                      value={jogador.imagem}
                      onChange={handleChange}
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                    {jogador.imagem && (
                      <div className="mt-3 text-center">
                        <Image
                          src={jogador.imagem}
                          alt="Preview"
                          fluid
                          thumbnail
                          style={{ maxHeight: "200px" }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/150?text=Imagem+Inválida";
                          }}
                        />
                      </div>
                    )}
                  </Form.Group>
                </div>

                {/* Coluna de habilidades */}
                <div className="col-md-6">
                  <div className="text-center mb-3">
                    <div
                      className="overall-badge mx-auto"
                      style={{
                        backgroundColor: getOverallColor(jogador.geral),
                      }}
                    >
                      {jogador.geral}
                    </div>
                    <div className="mt-2 text-muted">Média Geral</div>
                  </div>

                  {Object.entries(jogador.habilidades).map(
                    ([habilidade, valor]) => (
                      <Form.Group key={habilidade} className="mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <Form.Label className="mb-0 text-capitalize">
                            {habilidade}
                          </Form.Label>
                          <span
                            className="badge"
                            style={{ backgroundColor: getSkillColor(valor) }}
                          >
                            {valor}
                          </span>
                        </div>
                        <Form.Range
                          name={habilidade}
                          value={valor}
                          onChange={handleHabilidadeChange}
                          min="0"
                          max="99"
                        />
                        <ProgressBar
                          now={valor}
                          max={99}
                          variant="success"
                          style={{
                            height: "8px",
                            backgroundColor: "#e9ecef",
                          }}
                        />
                      </Form.Group>
                    )
                  )}
                </div>
              </div>

              <div className="d-grid mt-4">
                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Cadastrar Jogador"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default CadastroJogador;

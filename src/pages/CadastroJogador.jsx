// src/pages/CadastroJogador.jsx
import React, { useState } from "react";
import { Form, Button, Alert, Image } from "react-bootstrap";
import { aUHXaHEz } from "../utils/opaEIw";
import {
  cadastrarJogador,
  calcularMediaGeral,
} from "../services/jogadorService";

const CadastroJogador = () => {
  const [jogador, setJogador] = useState({
    nome: "",
    posicao: "DEF",
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
    if (!aUHXaHEz()) {
      return;
    }

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
    if (valor >= 80) return "#00a651"; // Verde escuro
    if (valor >= 70) return "#8dc63f"; // Verde claro
    if (valor >= 60) return "#ffc20e"; // Amarelo
    if (valor >= 40) return "#f7941d"; // Laranja
    return "#ed1c24"; // Vermelho
  };

  // Cor do overall (estilo FIFA)
  const getOverallColor = (valor) => {
    if (valor >= 80) return "#00a651"; // Verde escuro
    if (valor >= 70) return "#8dc63f"; // Verde claro
    if (valor >= 60) return "#ffc20e"; // Amarelo
    if (valor >= 40) return "#f7941d"; // Laranja
    return "#ed1c24"; // Vermelho
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <h2
            className="text-center mb-4"
            style={{
              color: "#39ff14",
              textShadow: "0 0 10px rgba(57, 255, 20, 0.5)",
            }}
          >
            Cadastrar Jogador
          </h2>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <div className="bg-transparent">
            <Form onSubmit={handleSubmit} className="p-3">
              <div className="row g-4">
                {/* Coluna de dados básicos */}
                <div className="col-md-6">
                  <Form.Group className="mb-4">
                    <Form.Label style={{ color: "#b0b0b0" }}>
                      Nome do Jogador
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="nome"
                      value={jogador.nome}
                      onChange={handleChange}
                      required
                      className="border-dark"
                      style={{
                        backgroundColor: "#1e1e1e",
                        color: "#f8f8f8",
                        borderBottom: "2px solid #39ff14",
                        borderRadius: "4px",
                        transition: "all 0.3s ease",
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label style={{ color: "#b0b0b0" }}>
                      Posição
                    </Form.Label>
                    <Form.Select
                      name="posicao"
                      value={jogador.posicao}
                      onChange={handleChange}
                      style={{
                        backgroundColor: "#1e1e1e",
                        color: "#f8f8f8",
                        borderBottom: "2px solid #39ff14",
                        borderRadius: "4px",
                      }}
                    >
                      <option value="DEF">Defesa</option>
                      <option value="MEI">Meia</option>
                      <option value="ATA">Ataque</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label style={{ color: "#b0b0b0" }}>
                      URL da Foto do Jogador
                    </Form.Label>
                    <Form.Control
                      type="url"
                      name="imagem"
                      value={jogador.imagem}
                      onChange={handleChange}
                      placeholder="https://exemplo.com/imagem.jpg"
                      style={{
                        backgroundColor: "#1e1e1e",
                        color: "#f8f8f8",
                        borderBottom: "2px solid #39ff14",
                        borderRadius: "4px",
                      }}
                    />
                    {jogador.imagem && (
                      <div className="mt-3 text-center">
                        <div
                          style={{
                            border: "1px solid #333",
                            padding: "5px",
                            borderRadius: "5px",
                            boxShadow: "0 0 10px rgba(57, 255, 20, 0.2)",
                          }}
                        >
                          <Image
                            src={jogador.imagem}
                            alt="Preview"
                            fluid
                            style={{
                              maxHeight: "200px",
                              objectFit: "contain",
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/150?text=Imagem+Inválida";
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </Form.Group>
                </div>

                {/* Coluna de habilidades */}
                <div className="col-md-6">
                  <div className="text-center mb-4">
                    <div
                      style={{
                        backgroundColor: getOverallColor(jogador.geral),
                        color: "#0e0e0e",
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.8rem",
                        fontWeight: "bold",
                        margin: "0 auto",
                        boxShadow: `0 0 15px ${getOverallColor(jogador.geral)}`,
                        transition: "all 0.3s ease",
                      }}
                    >
                      {jogador.geral}
                    </div>
                    <div
                      className="mt-2"
                      style={{ color: "#b0b0b0", letterSpacing: "1px" }}
                    >
                      MÉDIA GERAL
                    </div>
                  </div>

                  <div
                    className="py-2"
                    style={{
                      backgroundColor: "#1a1a1a",
                      borderRadius: "8px",
                      padding: "10px",
                    }}
                  >
                    {Object.entries(jogador.habilidades).map(
                      ([habilidade, valor]) => (
                        <Form.Group key={habilidade} className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <Form.Label
                              className="mb-0 text-capitalize"
                              style={{
                                color: "#b0b0b0",
                                letterSpacing: "0.5px",
                              }}
                            >
                              {habilidade}
                            </Form.Label>
                            <div
                              style={{
                                backgroundColor: getSkillColor(valor),
                                color: "#0e0e0e",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                fontWeight: "bold",
                                minWidth: "40px",
                                textAlign: "center",
                                transition: "all 0.3s ease",
                              }}
                            >
                              {valor}
                            </div>
                          </div>
                          <Form.Range
                            name={habilidade}
                            value={valor}
                            onChange={handleHabilidadeChange}
                            min="0"
                            max="99"
                            style={{
                              height: "32px",
                              cursor: "pointer",
                            }}
                          />
                          <div
                            style={{
                              height: "5px",
                              backgroundColor: "#333",
                              borderRadius: "3px",
                              marginTop: "-10px",
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${valor}%`,
                                backgroundColor: getSkillColor(valor),
                                borderRadius: "3px",
                                boxShadow: `0 0 5px ${getSkillColor(valor)}`,
                                transition: "all 0.3s ease",
                              }}
                            />
                          </div>
                        </Form.Group>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="d-grid mt-4">
                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  disabled={loading}
                  style={{
                    backgroundColor: "#39ff14",
                    borderColor: "#39ff14",
                    color: "#121212",
                    fontWeight: "600",
                    borderRadius: "6px",
                    boxShadow: "0 0 15px rgba(57, 255, 20, 0.5)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {loading ? "Salvando..." : "Cadastrar Jogador"}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroJogador;

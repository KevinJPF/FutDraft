// src/pages/Home.jsx
import React from "react";
import { Card, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "/logo.png";

const Home = () => {
  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <img
          src={logo}
          alt="FutDraft Logo"
          style={{
            height: "12rem",
            filter: "drop-shadow(0 0 12px rgba(57, 255, 20, 0.6))",
          }}
          className="mb-4"
        />
        <h1 className="display-4 fw-bold" style={{ color: "#39ff14" }}>
          FutDraft
        </h1>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <Card className="shadow border-0">
            <Card.Body className="p-4">
              <h2 className="mb-4 text-center" style={{ color: "#39ff14" }}>
                Bem-vindo ao FutDraft
              </h2>
              <p className="mb-5 text-center fs-5">
                Site para organizar o fut no Resenha em Poá, organizado por
                Kevin e Alexandre.
              </p>

              <div className="d-grid gap-4 mb-4">
                <Button
                  as={Link}
                  to="/regras"
                  variant="primary"
                  size="lg"
                  className="py-3 fw-bold"
                >
                  <i className="bi bi-shuffle me-2"></i>! Regras do Fut !
                </Button>
                <div className="d-flex flex-column flex-md-row gap-3">
                  <Button
                    as={Link}
                    to="/jogadores"
                    variant="secondary"
                    size="lg"
                    className="flex-grow-1 py-3"
                    style={{ borderColor: "#39ff14", color: "#39ff14" }}
                  >
                    <i className="bi bi-people-fill me-2"></i>
                    Ver Jogadores
                  </Button>

                  <Button
                    as={Link}
                    to="/cadastro"
                    variant="secondary"
                    size="lg"
                    className="flex-grow-1 py-3"
                    style={{ borderColor: "#39ff14", color: "#39ff14" }}
                  >
                    <i className="bi bi-person-plus-fill me-2"></i>
                    Cadastrar Jogador
                  </Button>
                </div>

                <Button
                  as={Link}
                  to="/sorteio"
                  variant="primary"
                  size="lg"
                  className="py-3 fw-bold"
                >
                  <i className="bi bi-shuffle me-2"></i>
                  Sortear Times
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default Home;

// src/pages/Home.jsx
import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "/logo.png";

const Home = () => {
  return (
    <div className="text-center">
      <h1 className="mb-4">
        <img src={logo} alt="" style={{ height: "10rem" }} />
      </h1>

      <div className="row justify-content-center mt-5">
        <div className="col-md-10">
          <Card className="shadow">
            <Card.Body>
              <h2 className="mb-3">Bem-vindo ao FutDraft</h2>
              <p className="mb-4">
                Este aplicativo permite cadastrar jogadores com suas
                habilidades, e sortear times equilibrados para suas partidas de
                futebol.
              </p>

              <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mb-3">
                <Button
                  as={Link}
                  to="/cadastro"
                  variant="primary"
                  size="lg"
                  className="w-100"
                >
                  <i className="bi bi-person-plus-fill me-2"></i>
                  Cadastrar Jogador
                </Button>

                <Button
                  as={Link}
                  to="/jogadores"
                  variant="success"
                  size="lg"
                  className="w-100"
                >
                  <i className="bi bi-people-fill me-2"></i>
                  Ver Jogadores
                </Button>
              </div>

              <Button
                as={Link}
                to="/sorteio"
                variant="danger"
                size="lg"
                className="w-100"
              >
                <i className="bi bi-shuffle me-2"></i>
                Sortear Times
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>

      <div className="mt-4 text-muted">
        <p>
          <small>
            Cadastre pelo menos 24 jogadores para poder realizar o sorteio de
            times.
          </small>
        </p>
      </div>
    </div>
  );
};

export default Home;

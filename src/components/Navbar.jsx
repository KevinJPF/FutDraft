// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar as BootstrapNavbar, Nav, Container } from "react-bootstrap";

const Navbar = () => {
  const location = useLocation();

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" fixed="bottom">
      <Container>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/" active={location.pathname === "/"}>
              <i className="bi bi-house-fill"></i> Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/cadastro"
              active={location.pathname === "/cadastro"}
            >
              <i className="bi bi-person-plus-fill"></i> Cadastrar
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/jogadores"
              active={location.pathname === "/jogadores"}
            >
              <i className="bi bi-people-fill"></i> Jogadores
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/sorteio"
              active={location.pathname === "/sorteio"}
            >
              <i className="bi bi-shuffle"></i> Sortear
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;

// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar as BootstrapNavbar, Nav, Container } from "react-bootstrap";

const Navbar = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const handleNavClick = () => {
    setExpanded(false); // fecha o menu ao clicar em qualquer item
  };

  return (
    <BootstrapNavbar
      bg="dark"
      variant="dark"
      expand="lg"
      fixed="top"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <Container>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link
              as={Link}
              to="/"
              active={location.pathname === "/"}
              onClick={handleNavClick}
            >
              <i className="bi bi-house-fill"></i> Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/cadastro"
              active={location.pathname === "/cadastro"}
              onClick={handleNavClick}
            >
              <i className="bi bi-person-plus-fill"></i> Cadastrar
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/jogadores"
              active={location.pathname === "/jogadores"}
              onClick={handleNavClick}
            >
              <i className="bi bi-people-fill"></i> Jogadores
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/sorteio"
              active={location.pathname === "/sorteio"}
              onClick={handleNavClick}
            >
              <i className="bi bi-shuffle"></i> Sortear
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/regras"
              active={location.pathname === "/regras"}
              onClick={handleNavClick}
            >
              <i className="bi bi-book-fill"></i> Regras
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;

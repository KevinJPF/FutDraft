// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Importação de Páginas
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CadastroJogador from "./pages/CadastroJogador";
import ListaJogadores from "./pages/ListaJogadores";
import SorteioTimes from "./pages/SorteioTimes";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-5 pt-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro" element={<CadastroJogador />} />
          <Route path="/jogadores" element={<ListaJogadores />} />
          <Route path="/sorteio" element={<SorteioTimes />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

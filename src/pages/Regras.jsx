// src/pages/Regras.jsx
import React from "react";
import { Container, Card } from "react-bootstrap";

const Regras = () => {
  return (
    <Container className="">
      <Card className="shadow border-0">
        <Card.Body className="">
          <h2 className="text-center" style={{ color: "#39ff14" }}>
            Regras do Futebol
          </h2>

          <div className="rule-section mb-5">
            <h4
              className="p-2 mb-3"
              style={{
                color: "#39ff14",
                borderLeft: "4px solid #39ff14",
                paddingLeft: "1rem",
              }}
            >
              Regra PRINCIPAL:
            </h4>
            <ul className="ps-4">
              <li className="mb-3">
                <strong>BRIGAS SÃO PROIBIDAS!</strong> Nada de xingamentos ou
                agressões físicas. Todos estão aqui para se divertir, e só
                chamamos pessoas legais para jogar. Em caso de entradas mais
                fortes, chamaremos a atenção do jogador para tomar mais cuidado.
                Se isso persistir, será considerado má intenção e poderá ser
                removido do grupo.
              </li>
            </ul>
          </div>

          <div className="rule-section mb-5">
            <h4
              className="p-2 mb-3"
              style={{
                color: "#39ff14",
                borderLeft: "4px solid #39ff14",
                paddingLeft: "1rem",
              }}
            >
              Regras de Sorteio:
            </h4>
            <ul className="ps-4">
              <li className="mb-3">
                O sorteio de times considera 2 jogadores coringa por time: um da
                parte superior do ranking (Unicórnio 🦄) e um da parte inferior
                (Raposa 🦊), visando maior equilíbrio entre os times. O restante
                dos jogadores (Guaxinins 🦝) são sorteados aleatoriamente entre
                os times.
              </li>
              <li className="mb-3">
                Em trocas de times, deve-se sempre trocar jogadores do mesmo
                tipo: 🦄 por 🦄, 🦊 por 🦊, e 🦝 por 🦝. Nunca troque um
                diferente do outro.
              </li>
            </ul>
          </div>

          <div className="rule-section mb-5">
            <h4
              className="p-2 mb-3"
              style={{
                color: "#39ff14",
                borderLeft: "4px solid #39ff14",
                paddingLeft: "1rem",
              }}
            >
              Regras das Partidas:
            </h4>
            <ul className="ps-4">
              <li className="mb-3">
                As partidas tem duração padrão de <strong>8 minutos</strong>,
                entretanto no caso de haver apenas 3 times em quadra a partida
                durará <strong>10 minutos</strong>.
              </li>
              <li className="mb-3">
                Caso um dos times abra um placar com <strong>dois gols</strong>{" "}
                de diferença à partir do
                <strong> terceiro gol</strong> será considerada vitória.
                <br /> Exemplos de vitória: 3x1 por dois gols de diferença, 4x2
                por dois gols de diferença. <br /> Exemplos de não vitória: 3x2
                apenas 1 gol de diferença, 4x3 apenas 1 gol de diferença, 2x0
                Ainda não chegou no terceiro gol.
              </li>
              <li className="mb-3">
                O goleiro <strong>não pode usar as mãos</strong> em recuos
                feitos pelo próprio time com os pés. Apenas com a cabeça ou
                tronco é permitido.
              </li>
              <li className="mb-3">
                Laterais devem ser cobrados por cima da cabeça. Não exigimos
                perfeição, mas "boliches" são proibidos.
              </li>
              <li className="mb-3">
                Faltas ou toques na mão não intencionais dentro da área resultam
                em shoot outs. Faltas graves ou mãos intencionais geram pênalti.
              </li>
              <li className="mb-3">
                Em caso de um jogador cair por se machucar/lesionar, será
                permitido parar o tempo até que o jogo retome.
              </li>
            </ul>
          </div>

          <div className="rule-section mb-5">
            <h4
              className="p-2 mb-3"
              style={{
                color: "#39ff14",
                borderLeft: "4px solid #39ff14",
                paddingLeft: "1rem",
              }}
            >
              Regras Gerais:
            </h4>
            <ul className="ps-4">
              <li className="mb-3">
                Em caso de empate, se houverem 2 times de próximo (Um completo e
                outro com pelo menos 4 jogadores) ambas equipes que empataram
                saem. Caso não hajam 2 times de próximo o time que ganhou a
                última se mantem na quadra, em caso de ser a primeira partida 2
                jogadores tiram par ou ímpar e quem vencer fica na quadra.
              </li>
            </ul>
          </div>

          <div className="rule-section">
            <h4
              className="p-2 mb-3"
              style={{
                color: "#39ff14",
                borderLeft: "4px solid #39ff14",
                paddingLeft: "1rem",
              }}
            >
              🤝 Regras de Boa Convivência:
            </h4>
            <ul className="ps-4">
              <li className="mb-3">
                Pontualidade: o jogo começa no horário combinado. Atrasos podem
                deixar gente de fora.
              </li>
              <li className="mb-3">
                Se não puder ir, avise com antecedência para organizarmos os
                times.
              </li>
              <li className="mb-3">
                Use calçado adequado! Evite chuteiras com travas altas e cuidado
                com calçados que não seja uma chuteira society, você VAI
                ESCORREGAR.
              </li>
              <li className="mb-3">
                Sem goleiro fixo se não houver voluntário — TODOS REVEZAM.
              </li>
              <li className="mb-3">
                Respeite a chamada de "bola saiu". Em dúvida, repete a jogada.
              </li>
              <li className="mb-3">
                Evite jogadas perigosas ou chutes de perto com força
                desnecessária, isso não é campeonato, somos todos amigos e todo
                mundo tem que acordar cedo pra trabalhar/estudar.
              </li>
              <li className="mb-3">
                Ninguém aqui é o Neymar! Não insulte o colega por estar jogando
                mal ou coisa do tipo. O foco é se divertir, não constranger
                ninguém.
              </li>
            </ul>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Regras;

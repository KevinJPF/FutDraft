import React from "react";
import { Container } from "react-bootstrap";

const Regras = () => {
  return (
    <Container className="mt-5 pt-5">
      <h2 className="mb-4">Regras do Futebol</h2>

      <h4 className="text-danger">Regra PRINCIPAL:</h4>
      <ul>
        <li>
          <strong>BRIGAS SÃO PROIBIDAS!</strong> Nada de xingamentos ou
          agressões físicas. Todos estão aqui para se divertir, e só chamamos
          pessoas legais para jogar. Em caso de entradas mais fortes, chamaremos
          a atenção do jogador para tomar mais cuidado. Se isso persistir, será
          considerado má intenção e poderá ser removido do grupo.
        </li>
      </ul>

      <h4 className="mt-4">Regras de Sorteio:</h4>
      <ul>
        <li>
          O sorteio de times considera 2 jogadores coringa por time: um da parte
          superior do ranking (Coringa 🃏) e um da parte inferior (Coringa ♦️),
          visando maior equilíbrio entre os times.
        </li>
        <li>
          Em trocas de times, deve-se sempre trocar jogadores do mesmo tipo: 🃏
          por 🃏, ♦️ por ♦️, e jogadores intermediários (Peões ♟️) por outros
          Peões ♟️. Nunca troque um coringa por um peão.
        </li>
      </ul>

      <h4 className="mt-4">Regras das Partidas:</h4>
      <ul>
        <li>
          O goleiro <strong>não pode usar as mãos</strong> em recuos feitos pelo
          próprio time com os pés. Apenas com a cabeça ou tronco é permitido.
        </li>
        <li>
          Laterais devem ser cobrados por cima da cabeça. Não exigimos
          perfeição, mas "boliches" são proibidos.
        </li>
        <li>
          Faltas ou toques na mão não intencionais dentro da área resultam em
          shoot outs. Faltas graves ou mãos intencionais geram pênalti.
        </li>
        <li>
          Em caso de um jogador cair por se machucar/lesionar, será permitido
          parar o tempo até que o jogo retome.
        </li>
      </ul>

      <h4 className="mt-4">Regras Gerais:</h4>
      <ul>
        <li>
          Em caso de empate, se houverem 2 times de próximo (Um completo e outro
          com pelo menos 4 jogadores) ambas equipes que empataram saem. Caso não
          hajam 2 times de próximo o time que ganhou a última se mantem na
          quadra, em caso de ser a primeira partida 2 jogadores tiram par ou
          ímpar e quem vencer fica na quadra.
        </li>
      </ul>

      <h4 className="mt-4">🤝 Regras de Boa Convivência:</h4>
      <ul>
        <li>
          Pontualidade: o jogo começa no horário combinado. Atrasos podem deixar
          gente de fora.
        </li>
        <li>
          Se não puder ir, avise com antecedência para organizarmos os times.
        </li>
        <li>
          Use calçado adequado! Evite chuteiras com travas altas e cuidado com
          calçados que não seja uma chuteira society, você VAI ESCORREGAR.
        </li>
        <li>Sem goleiro fixo se não houver voluntário — TODOS REVEZAM.</li>
        <li>Respeite a chamada de "bola saiu". Em dúvida, repete a jogada.</li>
        <li>
          Evite jogadas perigosas ou chutes de perto com força desnecessária,
          isso não é campeonato, somos todos amigos e todo mundo tem que acordar
          cedo pra trabalhar/estudar.
        </li>
        <li>
          Ninguém aqui é o Neymar! Não insulte o colega por estar jogando mal ou
          coisa do tipo. O foco é se divertir, não constranger ninguém.
        </li>
      </ul>
    </Container>
  );
};

export default Regras;

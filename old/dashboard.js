const express = require("express");
const router = express.Router();
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

//Configurações Gerais

router.use(cors({
    origin: '*'
}));
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json({ limit: "10mb" }));

// conexão banco de dados
const credentials = {
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "zyngo",
};

var connection = mysql.createPool(credentials);

//Rotas

// Dashboard de Curva de evolução e acertos por dificuldade
router.post("/dashTop", (req, res) => {
  const { email } = req.body;

  // Apresenta a Curva de evolucao
  connection.query(
    "SELECT acertos FROM provas WHERE codPessoa IN(SELECT codPessoa FROM pessoas WHERE email = ?) ORDER BY codProva DESC LIMIT 10",
    [email],
    (err, result) => {
      if (err) {
        res.send({ erro: "Houve um erro" });
      }

      if (result) {
        // Apresenta o total de acertos por dificuldade do usuário
        connection.query(
          "SELECT dificuldade, SUM(acertos) AS soma FROM provas WHERE codPessoa IN(SELECT codPessoa FROM pessoas WHERE email = ?) GROUP BY dificuldade",
          [email],
          (err, resultado) => {
            if (err) {
              res.send({ erro: "Houve um erro" });
            }

            if (resultado) {
              res.send({
                evolucao: result,
                resultado,
              });
            }
          }
        );
      }
    }
  );
});

// Dashboard de Pontuação obtida e posição no Ranking
router.post("/cardsDash", (req, res) => {
  const { email } = req.body;

  // Apresenta a pontuação do usuário
  connection.query(
    "SELECT pontuacao FROM pessoas WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        res.send({ erro: "Houve um erro" });
      }

      if (result) {
        // Apresenta a posição do usuário no ranking
        connection.query(
          "SELECT COUNT(codPessoa) + 1 AS posicao FROM pessoas WHERE pontuacao >  ? AND inativo = 0",
          [result[0].pontuacao],
          (err, resultado) => {
            if (err) {
              res.send({ erro: "Houve um erro" });
            }

            if (resultado) {
              res.send({
                pontuacao: result[0].pontuacao,
                posicao: resultado[0].posicao,
              });
            }
          }
        );
      }
    }
  );
});

// Dashboard de Tempo médio e Ranking
router.post("/dashBottom", (req, res) => {
  const { email } = req.body;

  // Apresenta o ranking simples
  connection.query(
    "SELECT pontuacao, CONCAT(nome,' ',sobrenome) AS nomeCompleto FROM pessoas WHERE inativo = 0 ORDER BY pontuacao DESC LIMIT 10",
    (err, result) => {
      if (err) {
        res.send({ erro: "Houve um erro" });
      }
      if (result) {
        // Apresenta a media de tempo do usuario por dificuldade
        connection.query(
          "SELECT dificuldade,AVG(tempo) AS media FROM provas WHERE codPessoa IN (SELECT codPessoa FROM pessoas WHERE email = ?) GROUP BY dificuldade",
          [email],
          (err, resultado) => {
            if (err) {
              res.send({ erro: "Houve um erro" });
            }
            if (resultado) {
              res.send({
                result,
                resultado,
              });
            }
          }
        );
      }
    }
  );
});


// Dashboard apresentado na homepage de Ranking, provas realizadas e posição
router.post("/homeDashboard", (req, res) => {
  const { email } = req.body;

  // Apresenta a posição do usuário no ranking
  connection.query(
    "SELECT COUNT(codPessoa) + 1 AS posicao FROM pessoas WHERE pontuacao > (SELECT pontuacao FROM pessoas WHERE email = ?) AND inativo = 0",
    [email],
    (err, resultCod) => {
      if (err) {
        res.send({ erro: "Houve um erro aqui" });
      }
      if (resultCod) {
        // Apresenta a quantidade de provas que o usuário realizou
        connection.query(
          "SELECT COUNT(codPessoa) AS provas FROM provas WHERE codPessoa IN (SELECT codPessoa FROM pessoas WHERE email = ?)",
          [email],
          (err, resultado) => {
            if (err) {
              res.send({ erro: "Houve um erro" });
            }
            if (resultado) {
              // Apresenta Ranking com avatar
              connection.query(
                "SELECT urlAvatar, pontuacao, CONCAT(nome,' ',sobrenome) AS nomeCompleto FROM pessoas WHERE inativo = 0 ORDER BY pontuacao DESC LIMIT 5",
                (err, result) => {
                  if (err) {
                    res.send({ erro: "Houve um erro" });
                  }
                  if (result) {
                    res.send({
                      ranking: result,
                      provas: resultado[0].provas,
                      posicao: resultCod[0].posicao,
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});
module.exports = router;

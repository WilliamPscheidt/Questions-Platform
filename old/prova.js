const express = require("express");
const router = express.Router();
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");

//Configurações Gerais

router.use(cors());
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
router.post("/listarPerguntas", (req, res) => {
  const { dificuldade } = req.body;
  connection.query(
    "SELECT codPergunta, pergunta, opcaoA, opcaoB, opcaoC, opcaoD, dificuldade FROM perguntas where dificuldade=? AND status = 0 ORDER BY RAND() LIMIT 10",
    [dificuldade],
    (err, result) => {
      if (err) {
        res.send({ erro: result });
      }

      if (result) {
        res.send({ result });
      }
    })
  });

router.post("/validarRespostas", (req, res) => {
    const { codPergunta, resposta, email, tempo } = req.body;
    var remoteIp = (req.headers['x-forwarded-for'] || '').split(',').pop() || // Recupera o IP de origem, caso a fonte esteja utilizando proxy
                    req.connection.remoteAddress || // Recupera o endereço remoto da chamada
                    req.socket.remoteAddress || // Recupera o endereço através do socket TCP
                    req.connection.socket.remoteAddress // Recupera o endereço através do socket da conexão

    let acertos = 0;
    let erros = 0;
    let pontuacao = 0;
    let tempoDec = 0;

    connection.query(
      "SELECT respostaCorreta, dificuldade FROM perguntas WHERE codPergunta IN (?) ORDER BY FIELD(codPergunta, ?)",
      [codPergunta,codPergunta],
      (err, result) => {
        if (err) {
          res.send({ erro: "Houve um erro =(" });
        }

        if (result) {
          //Conta acertos
          for (let i = 0; i < result.length; i++) {
            if (result[i].respostaCorreta == resposta[i]) {
              acertos++;
            }
          }
          
          // Valida o tempo
          tempoDec = 30 - tempo;

          //Verifica dificuldade
          if (result[0].dificuldade == "facil") {
            pontuacao = acertos * 13;
          } else if (result[0].dificuldade == "moderado") {
            pontuacao = acertos * 15;
          } else if (result[0].dificuldade == "dificil") {
            pontuacao = acertos * 17;
          } else {
            res.send({ erro: "Dificuldade não encontrada" });
          }

          //Conta erros
          erros = result.length - acertos;

          //Insere os dados na tabela provas
          connection.query(
            "SELECT codPessoa FROM pessoas WHERE email =?",
            [email],
            (err, resultCod) => {
              if (err) {
                res.send({ erro: "Houve um erro ao atualizar a tabela" });
              }
              if (resultCod) {
                connection.query(
                  "INSERT INTO provas (codPessoa,acertos,erros,dificuldade,tempo) VALUES (?,?,?,?,?)",
                  [resultCod[0].codPessoa, acertos, erros, result[0].dificuldade, tempoDec]
                );
                // Gera histórico
                for (let i = 0; i < codPergunta.length; i++) {
                    connection.query(
                      "INSERT INTO historico (codPessoa,codPergunta,respostaUsuario,ip) VALUES (?,?,?,?)",
                      [resultCod[0].codPessoa, codPergunta[i], resposta[i],remoteIp]
                    );
                }
              }
            }
          );

          //Acrescenta pontuação da prova na pontuação geral
          connection.query(
            "UPDATE pessoas SET pontuacao = pontuacao + ? WHERE email = ?",
            [pontuacao, email]
          );

          res.send({
            pontuacao: pontuacao,
            acertos: acertos,
            erros : erros
          });
        }
      }
    );
  });

module.exports = router;
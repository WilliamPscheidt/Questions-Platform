const express = require("express");
const router = express.Router();
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

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

/////////////////////////////////////////////////////////
// -------------- Sessão Admin Questões -------------- //
/////////////////////////////////////////////////////////

router.get("/listarPessoas", (req, res) => {
  connection.query("SELECT * FROM pessoas", (err, result) => {
    if (err) {
      res.send({ erro: "Houve um erro =(" });
    }

    if (result) {
      res.send({ result });
    }
  });
});

router.get("/listarQuestoes", (req, res) => {
  connection.query("SELECT * FROM perguntas WHERE status = 0", (err, result) => {
    if (err) {
      res.send({ erro: "Houve um erro =(" });
    }

    if (result) {
      res.send({ result });
    }
  });
});

router.post("/inserirQuestao", (req, res) => {
  const {
    pergunta,
    opcaoA,
    opcaoB,
    opcaoC,
    opcaoD,
    dificuldade,
    respostaCorreta,
  } = req.body;

  connection.query(
    "INSERT INTO perguntas (pergunta,opcaoA,opcaoB,opcaoC,opcaoD,dificuldade,respostaCorreta) values (?, ?, ?, ?, ?, ?, ?)",
    [pergunta, opcaoA, opcaoB, opcaoC, opcaoD, dificuldade, respostaCorreta],
    (err, result) => {
      if (err) {
        res.send({ erro: err });
      } else {
        res.send({ suceso: "Inserido com sucesso" });
      }
    }
  );
});

router.post("/excluirQuestoes", (req, res) => {
  const { id } = req.body;

  connection.query(
    "DELETE FROM perguntas WHERE codPergunta=?",
    [id],
    (err, result) => {
      if (err) {
        res.send({ erro: "Essa questão não existe" });
      }

      if (result.affectedRows > 0) {
        res.send({ sucesso: "Removida com sucesso" });
      } else {
        res.send({ erro: "Essa questão não existe, digite o ID correto" });
      }
    }
  );
});

router.post("/visualizarQuestao", (req, res) => {
  const { id } = req.body;
  connection.query(
    "SELECT * FROM perguntas WHERE codPergunta = ?",
    [id],
    (err, result) => {
      if (err) {
        res.send({ erro: "Essa questão não existe" });
      }

      if (result) {
        res.send({ result });
      }
    }
  );
});

router.post("/atualizarQuestao", (req, res) => {
  const {
    id,
    pergunta,
    opcaoA,
    opcaoB,
    opcaoC,
    opcaoD,
    dificuldade,
    respostaCorreta,
  } = req.body;

  if (
    pergunta == "" ||
    opcaoA == "" ||
    opcaoB == "" ||
    opcaoC == "" ||
    opcaoD == ""
    ) {
    res.send({ erro: "Digite em todos os campos" });
    return;
  }

  connection.query(
    "INSERT INTO perguntas (pergunta,opcaoA,opcaoB,opcaoC,opcaoD,dificuldade,respostaCorreta) values (?, ?, ?, ?, ?, ?, ?)",
    [pergunta, opcaoA, opcaoB, opcaoC, opcaoD, dificuldade, respostaCorreta],
    (err, result) => {
      if (err) {
        res.send({ erro: "Houve um erro!" });
      }

      if (result) {
        connection.query(
          "UPDATE perguntas SET status = 1 WHERE codPergunta = ?",
          [id],
          (err) => {
            if (err){
              res.send({erro : "Houve um erro!"})
            }
          })
        res.send({ sucesso: "Questão alterada com sucesso!" });
      }
    }
  );
});
//////////////////////////////////////////////////////
// -------------- FIM Admin Questões -------------- //
//////////////////////////////////////////////////////

/////////////////////////////////////////////////////////
// -------------- Sessão Admin Usuários -------------- //
/////////////////////////////////////////////////////////

router.post("/desativarConta", (req, res) => {
  const { email } = req.body;
  var validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (!email.match(validRegex)) {
    res.send({ erro: "Seu e-mail é invalido" });
    return;
  }
  connection.query(
    "UPDATE pessoas SET inativo = 1 WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        res.send({ erro: "Houve um erro =(" });
      }

      if (result) {
        res.send({ sucesso: "Conta inativada com sucesso!" });
      }
    }
  );
});

router.post("/reativarUsuario", (req, res) => {
  const { email } = req.body;
  var validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (!email.match(validRegex)) {
    res.send({ erro: "Seu e-mail é invalido" });
    return;
  }
  connection.query(
    "UPDATE pessoas SET inativo = 0 WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        res.send({ erro: "Houve um erro =(" });
      }

      if (result) {
        res.send({ sucesso: "Conta reativada com sucesso!" });
      }
    }
  );
});

router.post("/cadastrarAdmin", (req, res) => {
  const { email, admEmail } = req.body;
  var validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (!email.match(validRegex)) {
    res.send({ erro: "Seu e-mail é invalido" });
    return;
  }
  if (admEmail == "admin@bombeirosvoluntarios.top") {
    connection.query(
      "UPDATE pessoas SET admin = 1 WHERE email = ?",
      [email],
      (err, result) => {
        if (err) {
          res.send({ erro: "Houve um erro! " });
        }
        if (result) {
          res.send({ sucesso: "Usuário alterado com sucesso!" });
        }
      }
    );
  } else {
    res.send({ erro: "Você não é SuperAdmin!" });
  }
});

router.post("/removerAdmin", (req, res) => {
  const { email, admEmail } = req.body;
  var validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (!email.match(validRegex)) {
    res.send({ erro: "Seu e-mail é invalido" });
    return;
  }
  if (admEmail == "admin@bombeirosvoluntarios.top") {
    connection.query(
      "UPDATE pessoas SET admin = 0 WHERE email = ?",
      [email],
      (err, result) => {
        if (err) {
          res.send({ erro: "Houve um erro! " });
        }
        if (result) {
          res.send({ sucesso: "Usuário alterado com sucesso!" });
        }
      }
    );
  } else {
    res.send({ erro: "Você não é SuperAdmin!" });
  }
});

////////////////////////////////////////////////////////////
// ----------------- FIM Admin Usuários ----------------- //
////////////////////////////////////////////////////////////
module.exports = router;

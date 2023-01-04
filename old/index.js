const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

// Declara��o rotas
const mailer = require("./routes/mailer.js");
const admin = require("./routes/admin.js");
const prova = require("./routes/prova.js");
const dashboard = require("./routes/dashboard.js");

const senhaSecretaToken = "EDITAR";
const senhaSecretaAdmin = "EDITAR";

// Roteamento

app.use("/mailer", mailer);
app.use("/admin", admin);
app.use("/prova", prova);
app.use("/dashboard", dashboard);

// Configura��es Gerais
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "10mb" }));

const credentials = {
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "zyngo",
};

var connection = mysql.createPool(credentials);

// Rota para troca de senha e avatar do usu�rio
app.post("/api/trocarSenha", (req, res) => {
  const { email, urlAvatar, senha1, senha2 } = req.body;
  if (senha1.length == 0 && senha2.length == 0) {
    connection.query(
      "UPDATE pessoas SET urlAvatar = ? WHERE email = ?",
      [urlAvatar, email],
      (err, result) => {
        if (err) {
          res.send({ erro: "Houve um erro =(" });
        }
        if (result) {
          res.send({ sucesso: "Avatar alterado com sucesso!" });
        }
      }
    );
  } else {
    var textoUp = /[A-Z]/g;
    var numeros = /[0-9]/g;

    if (senha1.length <= 8) {
      res.send({ erro: "Digite uma senha com mais de 8 digitos" });
      return
    } else if (!senha1.match(textoUp)) {
      res.send({ erro: "Erro: A sua senha deve ter Maiusculo e min�sculo" });
      return
    } else if (!senha1.match(numeros)) {
      res.send({ erro: "Erro: Digite n�meros na sua senha" });
      return
    }
    if (senha1 != senha2){
      res.send({erro : "As senhas n�o coincidem!"})
      return
    }
    
    connection.query(
      "SELECT senha FROM pessoas WHERE email = ?",
      [email],
      (err, result) => {
        if (err) {
          res.send({ erro: "Houve um erro interno!" });
        }
        if (result) {
          bcrypt.hash(senha1, saltRounds, (err, hash) => {
            if (err) {
              res.send({ erro: "Houve um erro!" });
            }
            if (hash) {
              connection.query(
                "UPDATE pessoas SET senha = ?, urlAvatar = ?  WHERE email = ?",
                [hash, urlAvatar, email],
                (err, resultado) => {
                  if (err) {
                    res.send({ erro: "Essa senha n�o � v�lida" });
                  }
                  if (resultado ) {
                    res.send({ sucesso: "Dados alterados com sucesso!" });
                  }
                }
              );
            }
          });
        }
      }
    );
  }
});

// Rota para valida��o de token do usu�rio
app.post("/api/validarToken", (req, res) => {
  const { token } = req.body;

  jwt.verify(token, senhaSecretaToken, (err, decoded) => {
    if (err) {
      res.send({ erro: "O seu token n�o � v�lido" });
    }

    if (decoded) {
      res.send({ suceso: "O seu token foi validado com sucesso" });
    }
  });
});

// Rota para login e atribui��o de token
app.post("/api/login", (req, res) => {
  const { loginEmail, loginSenha } = req.body;

  connection.query(
    "SELECT nome,sobrenome,urlAvatar,senha,inativo FROM pessoas WHERE email = ?",
    [loginEmail],
    (err, result) => {
      if (err || result == "") {
        res.send({ erro: "Email n�o cadastrado!" });

      }
      if (result[0].inativo == 0) {
        bcrypt.compare(loginSenha, result[0].senha, (error, response) => {
          if (response == true) {
            const token = jwt.sign(
              { userEmail: loginEmail },
              senhaSecretaToken,
              { expiresIn: 3600 }
            );
            res.send({
              sucesso: "Usu�rio logado",
              token: token,
              nome: result[0].nome,
              sobrenome: result[0].sobrenome,
              avatar: result[0].urlAvatar,
              email: loginEmail,
            });
          }
          if (response == false) {
            res.send({ erro: "Senha incorreta!" });
          }
        });
      }
      if (result[0].inativo != 0) {
        res.send({
          erro: "Usu�rio est� inativo, entre em contato com um administrador do sistema para reativar seu cadastro!",
        });
      }
    }
  );
});

// Rota para valida��o de token do administrador
app.post("/api/validarTokenAdmin", (req, res) => {
  const { token } = req.body;

  jwt.verify(token, senhaSecretaAdmin, (err, decoded) => {
    if (err) {
      res.send({ erro: "O seu token n�o � v�lido" });
    }

    if (decoded) {
      res.send({ suceso: "O seu token foi validado com sucesso" });
    }
  });
});

// Rota para login e atribui��o de token da p�gina de administra��o
app.post("/api/validarAdmin", (req, res) => {
  const { email, senha } = req.body;

  if (!isNaN(email) || !isNaN(senha)) {
    res.send({ erro: "Digite em todos os campos!" });
    return;
  }

  connection.query(
    "SELECT senha,admin FROM pessoas WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        res.send({ erro: "Houve um erro interno!" });
      } else {
        if (result.length > 0) {
          bcrypt.compare(senha, result[0].senha, (error, response) => {
            if (error) {
              res.send({ erro: "Houve um erro interno!" });
            }
            if (response) {
              if (result[0].admin == 1) {
                const token = jwt.sign({ email: email }, senhaSecretaAdmin, {
                  expiresIn: 40000,
                });
                res.send({
                  sucesso:
                    "Verifica��es de acesso conclu�das, � um admministrador",
                  token: token,
                });
              } else {
                res.send({
                  erro: "Houve um erro, voc� n�o � um administrador =(",
                });
              }
            } else {
              res.send({ erro: "Senha incorreta" });
            }
          });
        } else {
          res.send({ erro: "Login inexistente" });
          console.log("Abc");
        }
      }
    }
  );
});

// Rota para registro de usu�rio
app.post("/api/registro", (req, res) => {
 
});

app.listen(4000, () => console.log("rodando..."));

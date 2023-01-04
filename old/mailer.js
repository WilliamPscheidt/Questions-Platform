const express = require("express");
const router = express.Router();
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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

router.post("/contato", (req, res) => {
  const { email, conteudo } = req.body;

  var validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (!email.match(validRegex)) {
    res.send({ erro: "Seu e-mail é invalido" });
    return;
  }

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "EDITAR",
    port: 465,
    ignoreTLS: true,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "EDITAR", // generated ethereal user
      pass: "EDITAR", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = transporter.sendMail({
    from: email, // sender address
    to: "EDITAR", // list of receivers
    subject: "Entrou em contato !", // Subject line
    text: conteudo, // plain text body
    html: "<p> " + conteudo + " </p>", // html body
  });
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  res.send({ sucesso: "Email enviado com sucesso!" });
});

router.post("/recuperarSenha", (req, res) => {
  const { email } = req.body;
  let novaSenha = getPassword();

  var validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (!email.match(validRegex)) {
    res.send({ erro: "Seu e-mail é invalido" });
    return;
  }

  connection.query(
    "SELECT email FROM pessoas WHERE email = ?",
    [email],
    (err, result) => {
      if (err || result.length <= 0 ) {
        res.send({ erro: "Email não existe!" });
      }
      if (result.length > 0) {
        enviaEmail(email, novaSenha);
        bcrypt.hash(novaSenha, saltRounds, (err, hash) => {
          connection.query("UPDATE pessoas SET senha = ? WHERE email = ?", [
            hash,
            email,
          ]);
        });
        res.send({ sucesso: "Senha Alterada com sucesso!" });
      } 
    }
  );
  function getPassword() {
    var chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJLMNOPQRSTUVWXYZ!@#$%^&*()+?><:{}[]";
    var passwordLength = 16;
    var password = "";

    for (var i = 0; i < passwordLength; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
    return password;
  }

  function enviaEmail(email, novaSenha) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "EDITAR",
      port: 465,
      ignoreTLS: true,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "EDITAR", // generated ethereal user
        pass: "EDITAR", // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = transporter.sendMail({
      from: '"Bombeiros Voluntarios 👻" EDITAR', // sender address
      to: email, // list of receivers
      subject: "Recuperação de senha!", // Subject line
      text: novaSenha, // plain text body
      // html: "<b>Sua nova senha: " + novaSenha + " </b>", // html body
      html:
        `<!doctype html>
        <html ⚡4email>
        <p>&nbsp;</p>
  <!-- Compiled with Bootstrap Email version: 1.1.5 -->
  <style type="text/css">
    body,
    table,
    td {
      font-family: Helvetica, Arial, sans-serif !important;
    }
    .ExternalClass {
      width: 100%;
    }
    .ExternalClass,
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td,
    .ExternalClass div {
      line-height: 150%;
    }
    a {
      text-decoration: none;
    }
    * {
      color: inherit;
    }
    a[x-apple-data-detectors],
    u + #body a,
    #MessageViewBody a {
      color: inherit;
      text-decoration: none;
      font-size: inherit;
      font-family: inherit;
      font-weight: inherit;
      line-height: inherit;
    }
    img {
      -ms-interpolation-mode: bicubic;
    }
    table:not([class^="s-"]) {
      font-family: Helvetica, Arial, sans-serif;
      border-spacing: 0px;
      border-collapse: collapse;
    }
    table:not([class^="s-"]) td {
      border-spacing: 0px;
      border-collapse: collapse;
    }
    @media screen and (max-width: 600px) {
      .w-full,
      .w-full > tbody > tr > td {
        width: 100% !important;
      }
      *[class*="s-lg-"] > tbody > tr > td {
        font-size: 0 !important;
        line-height: 0 !important;
        height: 0 !important;
      }
      .s-2 > tbody > tr > td {
        font-size: 8px !important;
        line-height: 8px !important;
        height: 8px !important;
      }
      .s-3 > tbody > tr > td {
        font-size: 12px !important;
        line-height: 12px !important;
        height: 12px !important;
      }
      .s-5 > tbody > tr > td {
        font-size: 20px !important;
        line-height: 20px !important;
        height: 20px !important;
      }
      .s-10 > tbody > tr > td {
        font-size: 40px !important;
        line-height: 40px !important;
        height: 40px !important;
      }
    }
  </style>
  <table
    class="bg-light body"
    style="
      outline: 0;
      width: 100%;
      min-width: 100%;
      height: 100%;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      font-family: Helvetica, Arial, sans-serif;
      line-height: 24px;
      font-weight: normal;
      font-size: 16px;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      color: #000000;
      margin: 0;
      padding: 0;
      border-width: 0;
    "
    role="presentation"
    border="0"
    cellspacing="0"
    cellpadding="0"
    bgcolor="#f7fafc"
  >
    <tbody>
      <tr>
        <td
          style="line-height: 24px; font-size: 16px; margin: 0"
          align="left"
          valign="top"
          bgcolor="#f7fafc"
        >
          <table
            class="container"
            style="width: 100%"
            role="presentation"
            border="0"
            cellspacing="0"
            cellpadding="0"
          >
            <tbody>
              <tr>
                <td
                  style="
                    line-height: 24px;
                    font-size: 16px;
                    margin: 0;
                    padding: 0 16px;
                  "
                  align="center"
                >
                  <!-- [if (gte mso 9)|(IE)]>
                        <table align="center" role="presentation">
                          <tbody>
                            <tr>
                              <td width="600">
                      <![endif]-->
                  <table
                    style="width: 100%; max-width: 600px; margin: 0 auto"
                    role="presentation"
                    border="0"
                    cellspacing="0"
                    cellpadding="0"
                    align="center"
                  >
                    <tbody>
                      <tr>
                        <td
                          style="line-height: 24px; font-size: 16px; margin: 0"
                          align="left"
                        >
                          <table
                            class="s-10 w-full"
                            style="width: 100%"
                            role="presentation"
                            border="0"
                            width="100%"
                            cellspacing="0"
                            cellpadding="0"
                          >
                            <tbody>
                              <tr>
                                <td
                                  style="
                                    line-height: 40px;
                                    font-size: 40px;
                                    width: 100%;
                                    height: 40px;
                                    margin: 0;
                                  "
                                  align="left"
                                  width="100%"
                                  height="40"
                                >
                                  &nbsp;
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <table
                            class="card"
                            style="
                              border-radius: 6px;
                              border-collapse: separate !important;
                              width: 100%;
                              overflow: hidden;
                              border: 1px solid #e2e8f0;
                            "
                            role="presentation"
                            border="0"
                            cellspacing="0"
                            cellpadding="0"
                            bgcolor="#ffffff"
                          >
                            <tbody>
                              <tr>
                                <td
                                  style="
                                    line-height: 24px;
                                    font-size: 16px;
                                    width: 100%;
                                    margin: 0;
                                  "
                                  align="left"
                                  bgcolor="#ffffff"
                                >
                                  <table
                                    class="card-body"
                                    style="width: 100%; height: 273px"
                                    role="presentation"
                                    border="0"
                                    cellspacing="0"
                                    cellpadding="0"
                                  >
                                    <tbody>
                                      <tr style="height: 273px">
                                        <td
                                          style="
                                            line-height: 24px;
                                            font-size: 16px;
                                            width: 100%;
                                            margin: 0px;
                                            padding: 20px;
                                            height: 273px;
                                          "
                                          align="left"
                                        >
                                          <h5
                                            class="text-teal-700"
                                            style="
                                              color: #13795b;
                                              padding-top: 0px;
                                              padding-bottom: 0px;
                                              font-weight: 500;
                                              vertical-align: baseline;
                                              font-size: 20px;
                                              line-height: 24px;
                                              margin: 0px;
                                              text-align: center;
                                            "
                                            align="left"
                                          >
                                            A sua solicita&ccedil;&atilde;o de
                                            altera&ccedil;&atilde;o de senha foi
                                            atendida!
                                          </h5>
                                          <table
                                            class="s-5 w-full"
                                            style="width: 100%"
                                            role="presentation"
                                            border="0"
                                            width="100%"
                                            cellspacing="0"
                                            cellpadding="0"
                                          >
                                            <tbody>
                                              <tr>
                                                <td
                                                  style="
                                                    line-height: 20px;
                                                    font-size: 20px;
                                                    width: 100%;
                                                    height: 20px;
                                                    margin: 0;
                                                  "
                                                  align="left"
                                                  width="100%"
                                                  height="20"
                                                >
                                                  &nbsp;
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                          <table
                                            class="hr"
                                            style="width: 100%"
                                            role="presentation"
                                            border="0"
                                            cellspacing="0"
                                            cellpadding="0"
                                          >
                                            <tbody>
                                              <tr>
                                                <td
                                                  style="
                                                    line-height: 24px;
                                                    font-size: 16px;
                                                    border-top-width: 1px;
                                                    border-top-color: #e2e8f0;
                                                    border-top-style: solid;
                                                    height: 1px;
                                                    width: 100%;
                                                    margin: 0;
                                                  "
                                                  align="left"
                                                >
                                                  &nbsp;
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                          <table
                                            class="s-5 w-full"
                                            style="width: 100%; height: 20px"
                                            role="presentation"
                                            border="0"
                                            width="100%"
                                            cellspacing="0"
                                            cellpadding="0"
                                          >
                                            <tbody>
                                              <tr style="height: 20px">
                                                <td
                                                  style="
                                                    line-height: 20px;
                                                    font-size: 20px;
                                                    width: 100%;
                                                    height: 20px;
                                                    margin: 0px;
                                                    text-align: center;
                                                  "
                                                  align="left"
                                                  width="100%"
                                                  height="20"
                                                >
                                                  Sua nova Senha:
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                          <br>
                                          <div class="space-y-3">
                                            <p
                                              class="text-gray-700"
                                              style="
                                                line-height: 24px;
                                                font-size: 16px;
                                                color: #4a5568;
                                                width: 100%;
                                                margin: 0px;
                                                text-align: center;
                                              "
                                              align="left"
                                            >
                                              <span style="font-size: 24pt">
                                                ` +
        novaSenha +
        `
                                              </span>
                                            </p>
                                            <table
                                              class="s-3 w-full"
                                              style="width: 100%"
                                              role="presentation"
                                              border="0"
                                              width="100%"
                                              cellspacing="0"
                                              cellpadding="0"
                                            >
                                              <tbody>
                                                <tr>
                                                  <td
                                                    style="
                                                      line-height: 12px;
                                                      font-size: 12px;
                                                      width: 100%;
                                                      height: 12px;
                                                      margin: 0;
                                                    "
                                                    align="left"
                                                    width="100%"
                                                    height="12"
                                                  >
                                                    &nbsp;
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                            <p
                                              class="text-gray-700"
                                              style="
                                                line-height: 24px;
                                                font-size: 16px;
                                                color: #4a5568;
                                                width: 100%;
                                                margin: 0;
                                              "
                                              align="left"
                                            >
                                              &nbsp;
                                            </p>
                                          </div>
                                          <table
                                            class="s-5 w-full"
                                            style="width: 100%"
                                            role="presentation"
                                            border="0"
                                            width="100%"
                                            cellspacing="0"
                                            cellpadding="0"
                                          >
                                            <tbody>
                                              <tr>
                                                <td
                                                  style="
                                                    line-height: 20px;
                                                    font-size: 20px;
                                                    width: 100%;
                                                    height: 20px;
                                                    margin: 0;
                                                  "
                                                  align="left"
                                                  width="100%"
                                                  height="20"
                                                >
                                                  &nbsp;
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                          <table
                                            class="btn btn-primary"
                                            style="
                                              border-radius: 6px;
                                              border-collapse: separate !important;
                                              height: 38px;
                                              width: 562px;
                                            "
                                            role="presentation"
                                            border="0"
                                            cellspacing="0"
                                            cellpadding="0"
                                          >
                                            <tbody>
                                              <tr style="height: 38px">
                                                <td
                                                  style="
                                                    line-height: 24px;
                                                    font-size: 16px;
                                                    border-radius: 6px;
                                                    margin: 0px;
                                                    height: 38px;
                                                    width: 558px;
                                                  "
                                                  align="center"
                                                  bgcolor="#0d6efd"
                                                >
                                                  <a
                                                    style="
                                                      color: #ffffff;
                                                      font-size: 16px;
                                                      font-family: Helvetica,
                                                        Arial, sans-serif;
                                                      text-decoration: none;
                                                      border-radius: 6px;
                                                      line-height: 20px;
                                                      display: block;
                                                      font-weight: normal;
                                                      white-space: nowrap;
                                                      background-color: #00d8b6;
                                                      padding: 8px 12px;
                                                      border: 1px solid #00d8b6;
                                                    "
                                                    href="https://bombeirosvoluntarios.top/acesso"
                                                    target="_blank"
                                                    rel="noopener"
                                                    >Acessar Minha Conta</a
                                                  >
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <table
                            class="s-10 w-full"
                            style="width: 100%"
                            role="presentation"
                            border="0"
                            width="100%"
                            cellspacing="0"
                            cellpadding="0"
                          >
                            <tbody>
                              <tr>
                                <td
                                  style="
                                    line-height: 40px;
                                    font-size: 40px;
                                    width: 100%;
                                    height: 40px;
                                    margin: 0;
                                  "
                                  align="left"
                                  width="100%"
                                  height="40"
                                >
                                  &nbsp;
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <!-- [if (gte mso 9)|(IE)]>
                      </td>
                    </tr>
                  </tbody>
                </table>
                      <![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
  </html>`,
    });
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  }
});

module.exports = router;

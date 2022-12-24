const DatabaseAdapter = require('../../../adapters/database-adapter')
const databaseAdapter = new DatabaseAdapter()

class UpdateQuestion {
    async route(req,res) {
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

        try {
            await databaseAdapter.query("INSERT INTO perguntas (pergunta,opcaoA,opcaoB,opcaoC,opcaoD,dificuldade,respostaCorreta) values (?, ?, ?, ?, ?, ?, ?)",[pergunta, opcaoA, opcaoB, opcaoC, opcaoD, dificuldade, respostaCorreta])
            await databaseAdapter.query("UPDATE perguntas SET status = 1 WHERE codPergunta = ?",[id])
        } catch (error) {
           return  res.send({error:"error in request"})
        }    
    }
}

module.exports = UpdateQuestion
const DatabaseAdapter = require('../../../adapters/database-adapter')
const databaseAdapter = new DatabaseAdapter()

class InsertQuestions {
    async route(req,res) {
        const {
            pergunta,
            opcaoA,
            opcaoB,
            opcaoC,
            opcaoD,
            dificuldade,
            respostaCorreta,
          } = req.body;

        try{
            await databaseAdapter.query("INSERT INTO perguntas (pergunta,opcaoA,opcaoB,opcaoC,opcaoD,dificuldade,respostaCorreta) values (?, ?, ?, ?, ?, ?, ?)", [pergunta, opcaoA, opcaoB, opcaoC, opcaoD, dificuldade, respostaCorreta])
            return res.send({success: "quest added"})
        } catch (error) {
            return res.send({error: "error in request"})
        }   
    }
}

module.exports = InsertQuestions
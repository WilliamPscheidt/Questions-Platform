const DatabaseAdapter = require('../../../adapters/database-adapter')
const databaseAdapter = new DatabaseAdapter()

class UpdateQuestion {
    async route(req,res) {
        const {
            id,
            question,
            optionA,
            optionB,
            optionC,
            optionD,
            dificulty,
            correctAnswer,
          } = req.body;

        try {
            await databaseAdapter.query("INSERT INTO questions (question,optionA,optionB,optionC,optionD,dificulty,correctAnswer) values (?, ?, ?, ?, ?, ?, ?)",[question, optionA, optionB, optionC, optionD, dificulty, correctAnswer])
            await databaseAdapter.query("UPDATE questions SET status = 1 WHERE codQuestion = ?",[id])
        } catch (error) {
           return  res.send({error:"error in request"})
        }    
    }
}

module.exports = UpdateQuestion
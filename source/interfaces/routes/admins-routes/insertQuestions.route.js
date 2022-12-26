const DatabaseAdapter = require('../../../adapters/database-adapter')
const databaseAdapter = new DatabaseAdapter()

class InsertQuestions {
    async route(req,res) {
        const {
            question,
            optionA,
            optionB,
            optionC,
            optionD,
            dificulty,
            correctAnswer,
          } = req.body;

        try{
            await databaseAdapter.query("INSERT INTO tests (question,optionA,optionB,opcaoC,optionD,dificulty,correctAnswer) values (?, ?, ?, ?, ?, ?, ?)", [question, optionA, optionB, optionC, optionD, dificulty, correctAnswer])
            return res.send({success: "quest added"})
        } catch (error) {
            return res.send({error: "error in request"})
        }   
    }
}

module.exports = InsertQuestions
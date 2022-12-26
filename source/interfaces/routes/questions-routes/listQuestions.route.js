const DatabaseAdapter = require('../../../adapters/database-adapter')
const databaseAdapter = new DatabaseAdapter()

class ListQuestions {
    route(req,res) {
        const { dificulty } = req.body;

        const tests = databaseAdapter.query("SELECT codQuestion, question, optionA, optionB, optionC, optionD, dificulty FROM questions where dificulty=? AND status = 0 ORDER BY RAND() LIMIT 10",[dificulty])

        if(tests.lenght>0){
            res.send({tests})
        } else {
            res.send({"Error": "no tests provided"})
        }
    }
}

module.exports = ListQuestions
const DatabaseAdapter = require('../../../adapters/database-adapter')
const databaseAdapter = new DatabaseAdapter()

class ListQuestions {
    async route(req,res) {
        const questionList = await databaseAdapter.query("SELECT * FROM perguntas WHERE status = 0")
        res.send({questionList})
    }
}

module.exports = ListQuestions
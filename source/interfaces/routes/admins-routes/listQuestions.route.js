const DatabaseAdapter = require('../../../adapters/database-adapter')
const databaseAdapter = new DatabaseAdapter()

class ListQuestions {
    static async route(req,res) {
        const questionList = await databaseAdapter.query("SELECT * FROM questions WHERE status = 0")
        res.send({questionList})
    }
}

module.exports = ListQuestions
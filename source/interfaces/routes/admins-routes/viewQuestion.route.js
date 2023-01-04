const DatabaseAdapter = require('../../../adapters/database-adapter')
const databaseAdapter = new DatabaseAdapter()

class ViewQuestion {
    static async route(req,res) {
        const { id } = req.body;

        const question = await databaseAdapter.query("SELECT * FROM questions WHERE codQuestion = ?",[id])
        res.send({question})
    }
}

module.exports = ViewQuestion
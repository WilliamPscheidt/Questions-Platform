const DatabaseAdapter = require('../../../adapters/database-adapter')
const databaseAdapter = new DatabaseAdapter()

class ViewQuestion {
    async route(req,res) {
        const { id } = req.body;

        const question = await databaseAdapter.query("SELECT * FROM perguntas WHERE codPergunta = ?",[id])
        res.send({question})
    }
}

module.exports = ViewQuestion
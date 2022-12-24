const DatabaseAdapter = require('../../../adapters/database-adapter')
const databaseAdapter = new DatabaseAdapter()

class RemoveQuestion {
    async route(req,res) {
        const { id } = req.body;

        try{
            await databaseAdapter.query("DELETE FROM perguntas WHERE codPergunta=?",[id])
            return res.send({success: "question removed"})
        } catch (error) {
            return res.send({error: "error in request"})
        }   
    }
}

module.exports = RemoveQuestion
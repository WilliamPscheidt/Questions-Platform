const DatabaseAdapter = require('../../../adapters/database-adapter')
const databaseAdapter = new DatabaseAdapter()

class RemoveQuestion {
    static async route(req,res) {
        const { id } = req.body;

        try{
            await databaseAdapter.query("DELETE FROM questions WHERE codQuestion=?",[id])
            return res.send({success: "question removed"})
        } catch (error) {
            return res.send({error: "error in request"})
        }   
    }
}

module.exports = RemoveQuestion
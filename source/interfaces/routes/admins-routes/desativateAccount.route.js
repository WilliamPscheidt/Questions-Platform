const DatabaseAdapter = require('../../../adapters/database-adapter')
const databaseAdapter = new DatabaseAdapter()

class DesativateAccount {
    async route(req,res) {
        const { email } = req.body;

        try {
            await databaseAdapter.query("UPDATE pessoas SET inativo = 1 WHERE email = ?",[email])
            res.send({success:"account inactivated"})
        } catch (error) {
            res.send({error:"error in request"})
        }
    }
}

module.exports = DesativateAccount
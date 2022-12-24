const DatabaseAdapter = require('../../../adapters/database-adapter')
const databaseAdapter = new DatabaseAdapter()

class ListAccounts {
    async route(req,res) {
        const accountList = await databaseAdapter.query("SELECT * FROM pessoas")
        res.send({accountList})
    }
}

module.exports = ListAccounts
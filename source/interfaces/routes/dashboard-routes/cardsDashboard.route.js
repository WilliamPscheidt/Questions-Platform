const DatabaseAdapter = require('../../../adapters/database-adapter')
const databaseAdapter = new DatabaseAdapter()

class DashboardCards {
    async route(req, res) {
        const { email } = req.body;

        const getPontuation = await databaseAdapter.query("SELECT pontuation FROM users WHERE email = ?", [email])

        if (getPontuation) {
            const queryResult = await databaseAdapter.query("SELECT COUNT(codUser) + 1 AS position FROM users WHERE pontuation > ? AND inactive = 0", getPontuation[0].pontuation)
            if (queryResult) {
                res.send({
                    pontuation: getPontuation[0].pontuation,
                    position: queryResult[0].position,
                });
            } else {
                res.send({
                    error: "Error in request"
                });
            }
        }

    }
}

module.exports = DashboardCards
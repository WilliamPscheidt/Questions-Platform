const DatabaseAdapter = require('../../../adapters/database-adapter')
const databaseAdapter = new DatabaseAdapter()

class DashboardCards {
    async route(req, res) {
        const { email } = req.body;

        const getPontuation = await databaseAdapter.query("SELECT pontuacao FROM pessoas WHERE email = ?", [email])

        if (getPontuation) {
            const queryResult = await databaseAdapter.query("SELECT COUNT(codPessoa) + 1 AS posicao FROM pessoas WHERE pontuacao >  ? AND inativo = 0", getPontuation[0].pontuacao)
            if (queryResult) {
                res.send({
                    pontuation: getPontuation[0].pontuacao,
                    position: queryResult[0].posicao,
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
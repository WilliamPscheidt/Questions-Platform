class DashboardTop {
    async route(req,res) {
        const { email } = req.body;

        const getPontuation = await databaseAdapter.query("SELECT acertos FROM provas WHERE codPessoa IN(SELECT codPessoa FROM pessoas WHERE email = ?) ORDER BY codProva DESC LIMIT 10", [email])

        if (getPontuation) {
            const queryResult = await databaseAdapter.query("SELECT dificuldade, SUM(acertos) AS soma FROM provas WHERE codPessoa IN(SELECT codPessoa FROM pessoas WHERE email = ?) GROUP BY dificuldade", [email])
            if (queryResult) {
                res.send({
                    evolution: queryResult,
                    queryResult,
                });
            } else {
                res.send({
                    error: "Error in request"
                });
            }
        }
    }
}

module.exports = DashboardTop
class DashboardBottom {
    async route(req, res) {
        const { email } = req.body;

        const getPontuation = await databaseAdapter.query("SELECT pontuacao, CONCAT(nome,' ',sobrenome) AS nomeCompleto FROM pessoas WHERE inativo = 0 ORDER BY pontuacao DESC LIMIT 10")

        if (getPontuation) {
            const queryResult = await databaseAdapter.query("SELECT dificuldade,AVG(tempo) AS media FROM provas WHERE codPessoa IN (SELECT codPessoa FROM pessoas WHERE email = ?) GROUP BY dificuldade")
            if (queryResult) {
                res.send({
                    getPontuation,
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

module.exports = DashboardBottom
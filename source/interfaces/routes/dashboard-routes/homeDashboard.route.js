class HomeDashboard {
    async route(req,res) {
        const { email } = req.body;

        const getPontuation = await databaseAdapter.query("SELECT COUNT(codPessoa) + 1 AS posicao FROM pessoas WHERE pontuacao > (SELECT pontuacao FROM pessoas WHERE email = ?) AND inativo = 0",[email])

        if (getPontuation) {
            const queryResult = await databaseAdapter.query("SELECT COUNT(codPessoa) AS provas FROM provas WHERE codPessoa IN (SELECT codPessoa FROM pessoas WHERE email = ?)",[email])
            if (queryResult) {
                const queryResult2 = await databaseAdapter.query("SELECT urlAvatar, pontuacao, CONCAT(nome,' ',sobrenome) AS nomeCompleto FROM pessoas WHERE inativo = 0 ORDER BY pontuacao DESC LIMIT 5")
                if(queryResult2) {
                    res.send({
                        ranking: queryResult2,
                        tests: queryResult[0].provas,
                        position: queryResult[0].posicao
                    });
                }
            } else {
                res.send({
                    error: "Error in request"
                });
            }
        }
    }
}

module.exports = HomeDashboard
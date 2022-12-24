const DatabaseAdapter = require('../../../adapters/database-adapter')
const databaseAdapter = new DatabaseAdapter()

class ValidateAnswer {
    async route(req, res) {
        const { answerCode, answer, email, time } = req.body;

        const hits = 0;
        const errors = 0;
        const pontuation = 0;
        const elapsedTime = 0;

        const getAnswers = await databaseAdapter.query("SELECT respostaCorreta, dificuldade FROM perguntas WHERE codPergunta IN (?) ORDER BY FIELD(codPergunta, ?)", [answerCode, answerCode])

        for (let i = 0; i < getAnswers.length; i++) {
            if (getAnswers[i].respostaCorreta == answer[i]) {
                hits++;
            }
        }

        elapsedTime = 30 - time;

        if (getAnswers[0].dificuldade == "facil") {
            pontuation = hits * 13;
        } else if (getAnswers[0].dificuldade == "moderado") {
            pontuation = hits * 15;
        } else if (getAnswers[0].dificuldade == "dificil") {
            pontuation = hits * 17;
        } else {
            res.send({ erro: "Dificuldade não encontrada" });
        }

        errors = getAnswers.length - hits;

        const userCode = await databaseAdapter.query("SELECT codPessoa FROM pessoas WHERE email =?", [email])

        try {
            await databaseAdapter.query("INSERT INTO provas (codPessoa,acertos,erros,dificuldade,tempo) VALUES (?,?,?,?,?)", [userCode, hits, errors, getAnswers[0].dificuldade, elapsedTime])
        } catch (erro) {
            return res.send({ error: "Error in requisition" });
        }

        try {
            await databaseAdapter.query("UPDATE pessoas SET pontuacao = pontuacao + ? WHERE email = ?", [pontuation, email])
        } catch (erro) {
            return res.send({ error: "Error in requisition" });
        }

        res.send({
            pontuation: pontuation,
            hits: hits,
            errors: errors
        });

    }
}

module.exports = ValidateAnswer
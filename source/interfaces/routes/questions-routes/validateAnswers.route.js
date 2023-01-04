const DatabaseAdapter = require('../../../adapters/database-adapter')
const databaseAdapter = new DatabaseAdapter()

class ValidateAnswer {
    static async route(req, res) {
        const { answerCode, answer, email, time } = req.body;

        const hits = 0;
        const errors = 0;
        const pontuation = 0;
        const elapsedTime = 0;

        const getAnswers = await databaseAdapter.query("SELECT correctAnswer, dificulty FROM questions WHERE codQuestion IN (?) ORDER BY FIELD(codQuestion, ?)", [answerCode, answerCode])

        for (let i = 0; i < getAnswers.length; i++) {
            if (getAnswers[i].correctAnswer == answer[i]) {
                hits++;
            }
        }

        elapsedTime = 30 - time;

        if (getAnswers[0].dificulty == "easy") {
            pontuation = hits * 13;
        } else if (getAnswers[0].dificulty == "moderate") {
            pontuation = hits * 15;
        } else if (getAnswers[0].dificulty == "hard") {
            pontuation = hits * 17;
        } else {
            res.send({ erro: "Dificuldade não encontrada" });
        }

        errors = getAnswers.length - hits;

        const userCode = await databaseAdapter.query("SELECT codPessoa FROM pessoas WHERE email =?", [email])

        try {
            await databaseAdapter.query("INSERT INTO tests (codUser,hits,mistakes,dificulty,time) VALUES (?,?,?,?,?)", [userCode, hits, errors, getAnswers[0].dificuldade, elapsedTime])
        } catch (erro) {
            return res.send({ error: "Error in requisition" });
        }

        try {
            await databaseAdapter.query("UPDATE users SET pontuation = pontuation + ? WHERE email = ?", [pontuation, email])
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
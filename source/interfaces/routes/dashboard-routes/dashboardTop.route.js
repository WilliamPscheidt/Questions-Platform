class DashboardTop {
    async route(req,res) {
        const { email } = req.body;

        const getPontuation = await databaseAdapter.query("SELECT hits FROM tests WHERE codUser IN(SELECT codUser FROM users WHERE email = ?) ORDER BY codTest DESC LIMIT 10", [email])

        if (getPontuation) {
            const queryResult = await databaseAdapter.query("SELECT dificulty, SUM(hits) AS sum FROM tests WHERE codUser IN(SELECT codUser FROM users WHERE email = ?) GROUP BY dificulty", [email])
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
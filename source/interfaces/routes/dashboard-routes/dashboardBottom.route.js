class DashboardBottom {
    async route(req, res) {
        const { email } = req.body;

        const getPontuation = await databaseAdapter.query("SELECT pontuation, CONCAT(name,' ',lastname) AS completeName FROM users WHERE inactive = 0 ORDER BY pontuation DESC LIMIT 10")

        if (getPontuation) {
            const queryResult = await databaseAdapter.query("SELECT dificulty,AVG(time) AS media FROM tests WHERE codUser IN (SELECT codUser FROM users WHERE email = ?) GROUP BY dificulty")
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
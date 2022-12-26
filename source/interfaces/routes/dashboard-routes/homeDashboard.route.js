class HomeDashboard {
    async route(req,res) {
        const { email } = req.body;

        const getPontuation = await databaseAdapter.query("SELECT COUNT(codUser) + 1 AS position FROM users WHERE pontuation > (SELECT pontuation FROM users WHERE email = ?) AND inactive = 0",[email])

        if (getPontuation) {
            const queryResult = await databaseAdapter.query("SELECT COUNT(codUser) AS tests FROM tests WHERE codUser IN (SELECT codUser FROM users WHERE email = ?)",[email])
            if (queryResult) {
                const queryResult2 = await databaseAdapter.query("SELECT urlAvatar, pontuation, CONCAT(name,' ',lastname) AS completeName FROM users WHERE inactive = 0 ORDER BY pontuation DESC LIMIT 5")
                if(queryResult2) {
                    res.send({
                        ranking: queryResult2,
                        tests: queryResult[0].tests,
                        position: queryResult[0].position
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
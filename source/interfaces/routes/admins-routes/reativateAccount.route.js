class ReativateAccount {
    async route(req,res) {
        const { email } = req.body;

        try {
            await databaseAdapter.query("UPDATE pessoas SET inativo = 0 WHERE email = ?",[email])
            res.send({success:"account reativated"})
        } catch (error) {
            res.send({error:"error in request"})
        }
    }
}

module.exports = ReativateAccount
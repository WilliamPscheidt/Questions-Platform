class ReativateAccount {
    static async route(req,res) {
        const { email } = req.body;

        try {
            await databaseAdapter.query("UPDATE users SET inactive = 0 WHERE email = ?",[email])
            res.send({success:"account reativated"})
        } catch (error) {
            res.send({error:"error in request"})
        }
    }
}

module.exports = ReativateAccount
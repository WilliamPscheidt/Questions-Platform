const TokenAdapter = require('../../../adapters/token-adapter');
const tokenAdapter = new TokenAdapter()

class ValidateAdminToken {
    static route(req,res) {
        const { token } = req.body;

        const verifyToken = tokenAdapter.verifyTokenAdmin(token)

        if(verifyToken) {
            res.send({ "success": "token validated" });
        } else {
            res.send({"error": "invalid token"})
        }
    }
}

module.exports = ValidateAdminToken
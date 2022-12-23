const TokenAdapter = require('../../../adapters/token-adapter');
const tokenAdapter = new TokenAdapter()

class ValidateToken {
    route(req,res) {
        const { token } = req.body;

        const verifyToken = tokenAdapter.verifyToken(token)

        if(verifyToken) {
            res.send({ "success": "token validated" });
        } else {
            res.send({"error": "invalid token"})
        }
    }
}

module.exports = ValidateToken
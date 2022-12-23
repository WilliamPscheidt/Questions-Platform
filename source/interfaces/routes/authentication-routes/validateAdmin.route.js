const DatabaseAdapter = require('../../../adapters/database-adapter')
const CryptographyAdapter = require('../../../adapters/cryptography-adapter')
const TokenAdapter = require('../../../adapters/token-adapter');

const databaseAdapter = new DatabaseAdapter()
const cryptographyAdapter = new CryptographyAdapter()
const tokenAdapter = new TokenAdapter()

class ValidateAdmin {
    async route(req, res) {
        const { email, password } = req.body;

        const selectUser = await databaseAdapter.query("SELECT senha,admin FROM pessoas WHERE email = ?",[email])

        if (!selectUser[0]) {
            return res.status(200).send({ "error": "Please, register this user first" })
        }

        if (!selectUser[0].admin == 1) {
            return res.status(200).send({ "error": "You is not a admin" })
        }

        const comparePasswords = await cryptographyAdapter.comparePasswordAndHash(password, selectUser[0].senha)
        
        if(comparePasswords) {
            const token = await tokenAdapter.signToken({"email": email}, 3000)
            res.status(200).send({"Success": "Login success", "token": token})
        } else {
            return res.status(200).send({ "Error": "Invalid password" })
        }
    }
}

module.exports = ValidateAdmin
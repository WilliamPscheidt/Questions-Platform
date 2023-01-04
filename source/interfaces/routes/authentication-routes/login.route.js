const DatabaseAdapter = require('../../../adapters/database-adapter')
const CryptographyAdapter = require('../../../adapters/cryptography-adapter')
const TokenAdapter = require('../../../adapters/token-adapter');

const databaseAdapter = new DatabaseAdapter()
const cryptographyAdapter = new CryptographyAdapter()
const tokenAdapter = new TokenAdapter()

class Login {
    static async route(req, res) {
        const { email, password } = req.body;

        const selectUser = await databaseAdapter.query("SELECT name,lastname,urlAvatar,password,inactive FROM users WHERE email = ?",[email])

        if (!selectUser[0]) {
            return res.status(200).send({ "error": "Please, register this user first" })
        }

        if (selectUser[0].inativo == 1) {
            return res.status(200).send({ "error": "This user is inactive" })
        }

        const comparePasswords = await cryptographyAdapter.comparePasswordAndHash(password, selectUser[0].password)
        
        if(comparePasswords) {
            const token = await tokenAdapter.signToken({"email": email}, 3000)
            res.status(200).send({"Success": "Login success", "token": token})
        } else {
            return res.status(200).send({ "Error": "Invalid password" })
        }
    }
}

module.exports = Login
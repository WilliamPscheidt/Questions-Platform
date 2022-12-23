const avatar = "https://api2.bombeirosvoluntarios.top/avatar/1.jpg"

const DatabaseAdapter = require('../../../adapters/database-adapter')
const CryptographyAdapter = require('../../../adapters/cryptography-adapter')
const TokenAdapter = require('../../../adapters/token-adapter');

const databaseAdapter = new DatabaseAdapter()
const cryptographyAdapter = new CryptographyAdapter()
const tokenAdapter = new TokenAdapter()

class Register {
    async route(req, res) {
        const { name, lastname, email, password } = req.body;

        const searchAccounts = await databaseAdapter.query("SELECT * FROM pessoas WHERE email = ?",[email])

        if (searchAccounts[0]) {
            return res.status(200).send({ "error": "User already registered"})
        }

        const token = await tokenAdapter.signToken({"email": email}, 3000)
        const hashedPassword = await cryptographyAdapter.encryptPassword(password)

        try {
            await databaseAdapter.query("INSERT INTO pessoas (nome,sobrenome,email,senha, urlAvatar) values (?, ?, ?, ?, ?)", [name, lastname, email, hashedPassword, avatar])
            res.send({
                success: "User registered",
                token: token,
            });
        } catch (error) {
            res.send({
                "error": error
            });   
        }
    }
}

module.exports = Register
const DatabaseAdapter = require('../../../adapters/database-adapter')
const CryptographyAdapter = require('../../../adapters/cryptography-adapter')

const databaseAdapter = new DatabaseAdapter()
const cryptographyAdapter = new CryptographyAdapter()

class ChangePassword {
    async route(req,res) {
        const { email, newPassword } = req.body;

        const hashedPassword = await cryptographyAdapter.encryptPassword(newPassword)
        
        try {
            await databaseAdapter.query("UPDATE pessoas SET senha = ? WHERE email = ?", [hashedPassword, email])
            res.send({"success": "password changed"})
        } catch (erro) {
            res.send({"error": "error on password change"})
        }
    }
}

module.exports = ChangePassword
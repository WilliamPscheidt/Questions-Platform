const jwt = require('jsonwebtoken')
const configuration = require("../configurations/configurations.json")

class Token {
    constructor() {
        this.tokenPassword = configuration.token.password
        this.tokenPasswordAdmin = configuration.token.passwordAdmin
    }

    async signToken(object, expires) {
        return await jwt.sign(object, this.tokenPassword, {
            expiresIn: expires,
        });
    }

    async verifyToken(token) {
        try {
            const decoded = await jwt.verify(token, this.tokenPassword);
            return true;
        } catch (err) {
            return false;
        }
    }

    async verifyTokenAdmin(token) {
        try {
            const decoded = await jwt.verify(token, this.tokenPasswordAdmin);
            return true;
        } catch (err) {
            return false;
        }
    }
}

module.exports = Token
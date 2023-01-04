class ChangePasswordRouteUseCase {
    static validate(req, res, next) {
        const { email, newPassword } = req.body;
        const regexValidatePasswordSecurity = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

        if (!email, !newPassword) {
            return res.status(400).send("Fill in all fields")
        }

        if (!newPassword.match(regexValidatePasswordSecurity)) {
            return res.status(400).send("Invalid password")
        }

        next()
    }
}

module.exports = ChangePasswordRouteUseCase
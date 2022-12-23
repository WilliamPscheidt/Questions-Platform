class RegisterRouteUseCase {
    validate(req, res, next) {
        const { name, lastname, email, password } = req.body;
        const regexEmailValidation = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        const regexValidatePasswordSecurity = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

        if (!name, !lastname, !email, !password) {
            return res.status(400).send("Fill in all fields")
        }

        if (!email.match(regexEmailValidation)) {
            return res.status(400).send("Invalid e-mail")
        }

        if (!password.match(regexValidatePasswordSecurity)) {
            return res.status(400).send("Invalid password")
        }

        next()
    }
}

module.exports = RegisterRouteUseCase
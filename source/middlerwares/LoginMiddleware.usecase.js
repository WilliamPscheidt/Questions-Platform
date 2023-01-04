class LoginRouteUseCase {
    static validate(req, res, next) {
        const { email, password } = req.body;

        if (!email, !password) {
            return res.status(400).send("Fill in all fields")
        }

        next()
    }
}

module.exports = LoginRouteUseCase
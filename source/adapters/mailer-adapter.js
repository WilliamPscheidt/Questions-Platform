const nodemailer = require("nodemailer")
const configurations = require("../configurations/configurations.json")

class Mailer {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: configurations.email_connection.host,
            port: configurations.email_connection.port,
            secure: configurations.email_connection.secure,
            auth: {
                user: configurations.email_connection.auth.user,
                pass: configurations.email_connection.auth.password,
            },
        });
    }

    async sendMail(from, to, subject, text, html) {
        try {
            await this.transporter.sendMail({
            from: from,
            to: to,
            subject: subject,
            text: text,
            html: html,
        });
            return true
        } catch (error) {
            return false
        }
    }
}

module.exports = Mailer
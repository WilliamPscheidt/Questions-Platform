const MailerAdapter = require("../../../adapters/mailer-adapter")
const mailer = new MailerAdapter()

class Contact {
    async route(req,res) {
        const { email, conteudo } = req.body;
        
        try {
            await mailer.sendMail("teste", email, "Entrou em contato", conteudo, conteudo )
            res.send({success:"contact sended"})
        } catch (error) {
            res.send({error:"error in request"})
        }
    }
}

module.exports = Contact
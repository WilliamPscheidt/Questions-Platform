const express = require('express')

class HttpServer {
    constructor() {
        this.express = express();
        this.middlewares();
    }

    middlewares() {
        this.express.use(express.json());
    }

    get(path, handler) {
        this.express.get(path, handler);
    }

    post(path, handler) {
        this.express.post(path, handler);
    }

    delete(path, handler) {
        this.express.delete(path, handler);
    }

    put(path, handler) {
        this.express.put(path, handler);
    }

    use(path, handler) {
        this.express.use(path, handler)
    }

    start() {
        this.express.listen(3000, () => {
            console.log("Server running")
        })
    }
}

module.exports = HttpServer;
const mysql = require("mysql2")
const configurations = require("../configurations/configurations.json")

class DatabaseAdapter {
    constructor() {
        this.pool = mysql.createPool(configurations.database_connection)
        this.pool.getConnection((error, success) => {
            if(error){ console.log("[-] Mysql connection error"); process.exit(1);} else {
                console.log("[+] Mysql online")
            }
        })
    }

    async query(sql, params) {
        return new Promise((resolve, reject) => {
            this.pool.query(sql, params, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            })
        })
    }

    async close() {
        return new Promise((resolve, reject) => {
            this.pool.end((error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve()
                }
            })
        })
    }
}

module.exports = DatabaseAdapter;

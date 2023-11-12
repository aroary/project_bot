const fs = require("fs");
const path = require("path");
const sql = require('mssql');

const pool = () => new sql.ConnectionPool({
    user: Buffer.from(process.env["DB_USERNAME"] || "", 'base64').toString('ascii'),
    password: Buffer.from(process.env["DB_PASSWORD"] || "", 'base64').toString('ascii'),
    server: process.env["DB_SERVER"],
    port: Number(process.env["DB_PORT"]) || 1433,
    database: process.env["DB_NAME"],
    authentication: { type: 'default' },
    options: { encrypt: true }
});

var db = pool();

setInterval(() => db = pool(), 600000).unref();

class Query {
    constructor (query) {
        this.query = query;
        this.declarations = [];
    };

    /**
     * @description Set the values of the variables in the query.
     * @param {string} key
     * @param {any} value
     * @param {"int"|"bigint"} type - The SQL type of value
     * @returns {Query}
     */
    declare(key, value, type) {
        this.declarations.push(`DECLARE @${key} AS ${type.toUpperCase()} = ${value}`);
        return this;
    };

    /**
     * @description Get the query with the declared variables.
     * @returns {Promise<sql.IResult,Error>}
     */
    send() {
        const query = this.declarations.join("\n") + "\n\n" + this.query;
        this.declarations = [];

        return new Promise((resolve, reject) => db
            .connect()
            .then(poolConnection => poolConnection
                .request()
                .query(query)
                .then(resolve)
                .catch(reject))// .finally(poolConnection.close()))
            .catch(process.report.writeReport));
    }
};

/**
 * @type {Map<string,Query>}
 */
const queries = new Map();

fs
    .readdirSync(path.join(__dirname, "./queries"))
    .filter(file => file.endsWith(".sql"))
    .map(file => ({ name: file, value: new Query(fs.readFileSync(path.join(__dirname, "./queries/", file))) }))
    .forEach(file => queries.set(file.name.replace(".sql", ""), file.value));

module.exports = { Query, queries, db };
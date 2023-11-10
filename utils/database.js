const fs = require("fs");
const path = require("path");
const sql = require('mssql');

const config = {
    user: Buffer.from(process.env["DB_USERNAME"], 'base64').toString('ascii'),
    password: Buffer.from(process.env["DB_PASSWORD"], 'base64').toString('ascii'),
    server: process.env["DB_SERVER"],
    port: Number(process.env["DB_PORT"]) || 1433,
    database: process.env["DB_NAME"],
    authentication: { type: 'default' },
    options: { encrypt: true }
};

/**
 * @typedef {{type:string}} DBAuthenticationConfig
 * @typedef {{encrypt:boolean}} DBOptionsConfig
 * @typedef {{user:string,password:string,server:string,port:number,database:string,authentication:DBAuthenticationConfig,options:DBOptionsConfig}} DBConfig
 */

const db = sql.connect(config);

// sql
//     .connect(config)
//     .then(poolConnection => poolConnection
//         .request()
//         .query(`SELECT TOP 10 * FROM [dbo].[member_points]`)
//         .then(resultSet => {
//             console.log(`${resultSet.recordset.length} rows returned.`);
//             console.table(resultSet.recordset);
//         })
//         .catch(process.report.writeReport)
//         .finally(poolConnection.close))
//     .catch(process.report.writeReport);

class Query {
    constructor (query) {
        this.query = query;
        this.declarations = [];
    };

    /**
     * @description Set the values of the variables in the query.
     * @param {string} key
     * @param {any} value
     * @param {string} type - The SQL type of value
     * @returns {Query}
     */
    declare(key, value, type) {
        this.declarations.push(`DECLARE @${key} AS ${type.toUpperCase()} = ${value}`);
        return this;
    };

    /**
     * @description Get the query with the declared variables.
     * @returns {string}
     */
    compile() {
        const query = this.declarations.join("\n") + "\n\n" + this.query;

        this.declarations = [];

        return query;
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
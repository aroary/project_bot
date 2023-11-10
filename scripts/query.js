const sql = require('mssql');

if (!process.env["DB_USERNAME"] || !process.env["DB_PASSWORD"]) require('dotenv').config();

const config = {
    user: Buffer.from(process.env["DB_USERNAME"], 'base64').toString('ascii'),
    password: Buffer.from(process.env["DB_PASSWORD"], 'base64').toString('ascii'),
    server: process.env["DB_SERVER"],
    port: Number(process.env["DB_PORT"]) || 1433,
    database: process.env["DB_NAME"],
    authentication: { type: 'default' },
    options: { encrypt: true }
};

if (require.main === module) {
    require("../utils/error")();
    require('dotenv').config();

    sql
        .connect(config)
        .then(poolConnection => poolConnection
            .request()
            .query(`SELECT TOP 10 * FROM [dbo].[member_points]`)
            .then(resultSet => {
                console.log(`${resultSet.recordset.length} rows returned.`);
                console.table(resultSet.recordset);
            })
            .catch(process.report.writeReport)
            .finally(poolConnection.close))
        .catch(process.report.writeReport);
} else module.exports = { config };
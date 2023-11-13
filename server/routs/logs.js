const fs = require("fs");
const { ClientRequest, ServerResponse } = require("http");
const { parse } = require("url");
const path = require("path");
const mime = require("mime");

/**
 * @param {ClientRequest} req
 * @param {ServerResponse} res
 */
function handle(req, res) {
    const token = parse(req.url, true).query.token || req.headers.token;

    if (token === process.env["ADMIN_TOKEN"]) res
        .setHeader("Content-Type", mime.getType("json"))
        .end(JSON.stringify(fs
            .readdirSync(path.join(__dirname, "../../logs"))
            .filter(file => file.endsWith(".json"))
            .map(file => require(path.join(__dirname, "../../logs/", file)))));
    else res
        .writeHead(401, ":(")
        .end();
}

module.exports = { methods: ["GET"], routs: ["/logs"], call: handle };
const fs = require("fs");
const path = require("path");
const { ClientRequest, ServerResponse } = require("http");
const mime = require("mime");

/**
 * @param {ClientRequest} req
 * @param {ServerResponse} res
 */
function handle(req, res) {
    res
        .setHeader("Content-Type", mime.getType("html"))
        .end(fs.readFileSync(path.join(__dirname, "../static/index.html")));
}

module.exports = { methods: ["GET"], routs: ["/", "/home", "/index"], call: handle };
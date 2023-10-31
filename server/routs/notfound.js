const { ClientRequest, ServerResponse } = require("http");

/**
 * @param {ClientRequest} req
 * @param {ServerResponse} res
 */
function handle(req, res) {
    res.writeHead(404, ":|").end();
}

module.exports = { methods: ["GET", "POST", "PUT", "DELETE"], routs: ["/notfound"], call: handle };
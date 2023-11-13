const { ClientRequest, ServerResponse } = require("http");

/**
 * @param {ClientRequest} req
 * @param {ServerResponse} res
 */
function handle(req, res) {
    res
        .writeHead(302, { 'Location': '/admin.html' })
        .end();
}

module.exports = { methods: ["GET"], routs: ["/admin"], call: handle };
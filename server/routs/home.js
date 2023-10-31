const { ClientRequest, ServerResponse } = require("http");

/**
 * @param {ClientRequest} req
 * @param {ServerResponse} res
 */
function handle(req, res) {
    res.writeHead(302, { 'Location': 'https://discord.gg/d39DnYurrU' }).end();
}

module.exports = { methods: ["GET"], routs: ["/", "/discord"], call: handle };
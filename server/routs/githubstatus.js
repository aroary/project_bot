const { ClientRequest, ServerResponse } = require("http");

/**
 * @param {ClientRequest} req
 * @param {ServerResponse} res
 */
function handle(req, res) {
    var body = [];
    req
        .on('data', chunk => body.push(chunk))
        .on('end', () => body = Buffer.concat(body).toString())
        .on("error", console.log);

    res.writeHead(200, ":)").end();
}

module.exports = { methods: ["GET", "POST"], routs: ["/githubstatus"], call: handle };
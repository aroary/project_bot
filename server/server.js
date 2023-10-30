const http = require("http");

const server = http.createServer();

server.on("request", (req, res) => {
    console.log("Server:", "request");
    res.writeHead(302, { 'Location': 'https://discord.gg/d39DnYurrU' }).end();
});

// Listen
server.listen(Number(process.env["PORT"]) || 3000, () => console.log("Server:", "Online"));

module.exports = server;
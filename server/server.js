const fs = require("fs");
const { Server } = require("http");
const path = require("path");
const mime = require("mime");

class App extends Server {
    routs = new Map();
};

const server = new App();

// Load routs
fs
    .readdirSync(path.join(__dirname, "./routs/"))
    .filter(file => file.endsWith(".js"))
    .forEach(file => {
        const { methods, routs, call } = require(`./routs/${file}`);
        methods.forEach(method => routs.forEach(rout => server.routs.set(`${method} ${rout}`, call)));
    })

server.on("request", (req, res) => {
    const { method, url } = req;

    const dir = /[\/[\w\.]*]*/m.exec(url)[0];
    console.log(dir, path.join(__dirname, "./static/", dir));
    const rout = server.routs.get(`${method} ${dir}`);

    if (rout) rout(req, res);
    else if (fs.existsSync(path.join(__dirname, "./static/", dir))) res
        .setHeader("Content-Type", mime.getType(dir))
        .end(fs.readFileSync(path.join(__dirname, "./static/", dir)));
    else res
        .writeHead(302, { 'Location': '/notfound' })
        .end();

    console.log("Server:", method, url);
});

// Listen
server.listen(Number(process.env["PORT"]) || 3000, () => console.log("Server:", "Online"));

module.exports = server;
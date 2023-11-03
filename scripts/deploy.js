const { REST, Routes } = require("discord.js");

const rest = new REST().setToken(process.env["BOT_TOKEN"]);

function reset() {
    return rest.put(Routes.applicationCommands(process.env["BOT_APP_ID"]), { body: [] });
}

function deploy(commands) {
    return rest.put(Routes.applicationCommands(process.env["BOT_APP_ID"]), { body: commands });
}

if (require.main === module) {
    require('dotenv').config();

    const fs = require("fs");

    // Set error report directory
    fs.mkdirSync("../logs", { recursive: true });
    for (const file of fs.readdirSync("../logs")) fs.unlinkSync("../logs/" + file);
    process.report.directory = "../logs";
    process.report.reportOnFatalError = true;
    process.report.reportOnSignal = true;
    process.report.reportOnUncaughtException = true;

    if (process.argv.includes("--reset")) reset
        .then(() => console.log("Client:", "Deployed"))
        .catch(process.report.writeReport);
    else deploy(fs
        .readdirSync(path.join(__dirname, "../client/commands"))
        .filter(file => file.endsWith(".js"))
        .map(file => require(`../client/commands/${file}`).command))
        .then(() => console.log("Client:", "Deployed"))
        .catch(process.report.writeReport);
} else module.exports = { reset, deploy };
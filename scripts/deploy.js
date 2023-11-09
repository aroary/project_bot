const { REST, Routes } = require("discord.js");

if (!process.env["BOT_TOKEN"] || !process.env["BOT_APP_ID"]) require('dotenv').config();

const rest = new REST().setToken(process.env["BOT_TOKEN"]);

function reset() {
    return rest.put(Routes.applicationCommands(process.env["BOT_APP_ID"]), { body: [] });
}

function deploy(commands) {
    return rest.put(Routes.applicationCommands(process.env["BOT_APP_ID"]), { body: commands });
}

if (require.main === module) {
    require("../utils/error")();
    require('dotenv').config();

    const fs = require("fs");
    const path = require("path");

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
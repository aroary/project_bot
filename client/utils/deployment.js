const { REST, Routes } = require("discord.js");

const rest = new REST().setToken(process.env["BOT_TOKEN"]);

function reset() {
    return rest.put(Routes.applicationCommands(process.env["BOT_APP_ID"]), { body: [] });
}

function deploy(commands) {
    return rest.put(Routes.applicationCommands(process.env["BOT_APP_ID"]), { body: commands });
}

module.exports = { reset, deploy };
const { REST, Routes } = require("discord.js");

const rest = new REST().setToken(process.env["BOT_TOKEN"]);

function reset() {
    return rest.put(Routes.applicationCommands(process.env["BOT_APP_ID"]), { body: [] });
}

function deploy(chatInputCommands) {
    return rest.put(Routes.applicationCommands(process.env["BOT_APP_ID"]), { body: chatInputCommands });
}

module.exports = { reset, deploy };
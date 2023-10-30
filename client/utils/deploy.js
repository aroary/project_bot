const { REST, Routes } = require("discord.js");

const rest = new REST().setToken(process.env["BOT_TOKEN"]);

function deploy(chatInputCommands) {
    return rest.put(Routes.applicationGuildCommands(process.env["BOT_APP_ID"], process.env["SERVER_ID"]), { body: chatInputCommands });
}

module.exports = deploy;
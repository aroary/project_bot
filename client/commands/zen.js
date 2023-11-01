const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
const { request } = require("@octokit/request");

const command = new SlashCommandBuilder()
    .setName("zen")
    .setDescription("Ping the bot");

/**
 * @param {CommandInteraction} interaction 
 */
function handle(interaction) {
    request("GET /zen")
        .then(response => interaction
            .reply({ content: response.data })
            .catch(process.report.writeReport))
        .catch(process.report.writeReport);
}

module.exports = { command, call: handle };
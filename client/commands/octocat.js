const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
const { request } = require("@octokit/request");

const command = new SlashCommandBuilder()
    .setName("octocat")
    .setDescription("octocat ASCII art");

/**
 * @param {CommandInteraction} interaction 
 */
function handle(interaction) {
    request("GET /octocat")
        .then(response => interaction
            .reply({ content: "```\n" + new TextDecoder("utf8").decode(response.data) + "\n```" })
            .catch(process.report.writeReport))
        .catch(process.report.writeReport);
}

module.exports = { command, call: handle };
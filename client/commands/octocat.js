const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
const { request } = require("@octokit/request");

const command = new SlashCommandBuilder()
    .setName("octocat")
    .setDescription("Ping the bot");

/**
 * @param {CommandInteraction} interaction 
 */
function handle(interaction) {
    request("GET /octocat")
        .then(response => interaction
            .reply({ content: "```\n" + new TextDecoder("utf8").decode(response.data) + "\n```" })
            .catch(console.log))
        .catch(console.log);
}

module.exports = { command, call: handle };
const { SlashCommandBuilder, CommandInteraction } = require('discord.js');

const command = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ping the bot");

/**
 * @param {CommandInteraction} interaction 
 */
function handle(interaction) {
    const client = require("../client");

    interaction
        .reply({ content: `*${client.ws.ping}ms*`, ephemeral: true })
        .catch(process.report.writeReport);
}

module.exports = { command, call: handle };
const { SlashCommandBuilder, CommandInteraction } = require('discord.js');

const command = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ping the bot");

/**
 * 
 * @param {CommandInteraction} interaction 
 */
function handle(interaction) {
    interaction.reply({ content: "Pong", ephemeral: true });
}

module.exports = { command, call: handle };
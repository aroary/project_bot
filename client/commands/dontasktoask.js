const { SlashCommandBuilder, CommandInteraction, SlashCommandUserOption } = require('discord.js');

const command = new SlashCommandBuilder()
    .setName("dontasktoask")
    .setDescription("Dont ask to ask, just ask.")
    .addUserOption(new SlashCommandUserOption()
        .setName("member")
        .setDescription("Member who asked to ask.")
        .setRequired(false));

/**
 * @param {CommandInteraction} interaction 
 */
function handle(interaction) {
    const member = interaction.options.getUser("member");
    interaction.reply({ content: `${member ? `<@${member.id}>, ` : ""}https://dontasktoask.com/` });
}

module.exports = { command, call: handle };
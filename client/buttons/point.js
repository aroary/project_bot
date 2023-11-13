const { ButtonBuilder, ButtonStyle, ButtonInteraction } = require("discord.js");

const button = new ButtonBuilder()
    .setCustomId("point")
    .setLabel("Point")
    .setEmoji("💥")
    .setStyle(ButtonStyle.Primary);

const pointage = new Map();

/**
 * @param {ButtonInteraction} interaction
 */
function handle(interaction) {
    interaction.reply({ content: "hi" });
    console.log(interaction.message.id);
}

module.exports = { button, call: handle };
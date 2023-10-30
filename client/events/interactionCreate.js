const { Events, Interaction } = require("discord.js");

/**
 * @param {Interaction} interaction
 */
function handle(interaction) {
    const client = require("../client");

    if (interaction.isChatInputCommand()) {
        const command = client.chatInputCommands.get(interaction.commandName);
        if (command) command.call(interaction);
        else interaction.reply({ content: "Something whent worng", ephemeral: true });
    }

    console.log("Client:", interaction.commandName);
}

module.exports = { event: Events.InteractionCreate, call: handle };
const { Events, Interaction } = require("discord.js");

/**
 * @param {Interaction} interaction
 */
function handle(interaction) {
    const client = require("../client");

    if (interaction.isChatInputCommand() || interaction.isMessageContextMenuCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (command) command.call(interaction);
        else interaction.reply({ content: "Something whent worng", ephemeral: true });
    } else if (interaction.isAutocomplete()) {
        const command = client.commands.get(interaction.commandName);
        if (command && command.autoComplete) command.autoComplete(interaction);
        else;
    }

    console.log("Client:", interaction.commandName);
}

module.exports = { event: Events.InteractionCreate, call: handle };
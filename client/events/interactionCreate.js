const { Events, Interaction, ChannelType } = require("discord.js");
const { queries } = require("../../utils/database")
/**
 * @param {Interaction} interaction
 */
function handle(interaction) {
    const client = require("../client");

    if (interaction.isChatInputCommand() || interaction.isMessageContextMenuCommand() || interaction.isUserContextMenuCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (command) command.call(interaction);
        else interaction.reply({ content: "Something whent wrong", ephemeral: true });

        // Add points
        if (interaction.channel.type.type !== ChannelType.DM) queries
            .get("increment")
            .declare("id", interaction.member.id, "bigint")
            .declare("points", interaction.member.premiumSince ? 2 : 1, "int")
            .send()
            .catch(process.report.writeReport);
    } else if (interaction.isAutocomplete()) {
        const command = client.commands.get(interaction.commandName);
        if (command && command.autoComplete) command.autoComplete(interaction);
        else;
    }

    console.log("Client:", interaction.commandName);
}

module.exports = { event: Events.InteractionCreate, call: handle };
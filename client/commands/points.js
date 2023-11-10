const { ContextMenuCommandBuilder, ApplicationCommandType, CommandInteraction } = require('discord.js');
const { queries } = require("../../utils/database");

const command = new ContextMenuCommandBuilder()
    .setName("Points")
    .setType(ApplicationCommandType.User);

/**
 * @param {CommandInteraction} interaction 
 */
function handle(interaction) {
    if (interaction.targetUser.bot) interaction
        .reply({
            content: `<@${interaction.targetUser.id}> has **${Infinity}** points!`,
            ephemeral: true
        })
        .catch(process.report.writeReport);
    else queries
        .get("amount")
        .declare("id", interaction.targetUser.id, "bigint")
        .send()
        .then(resultSet => interaction
            .reply({
                content: `<@${interaction.targetUser.id}> has **${resultSet.recordset[0]?.points || 0}** points!`,
                ephemeral: true
            })
            .catch(process.report.writeReport))
        .catch(process.report.writeReport);
}

module.exports = { command, call: handle };
const { ContextMenuCommandBuilder, ApplicationCommandType, CommandInteraction } = require('discord.js');
const { queries } = require("../../utils/database");

const command = new ContextMenuCommandBuilder()
    .setName("Points")
    .setType(ApplicationCommandType.User);

/**
 * @param {CommandInteraction} interaction 
 */
function handle(interaction) {
    console.log(1);
    queries
        .get("amount")
        .declare("id", interaction.member.id, "bigint")
        .send()
        .then(resultSet => interaction
            .reply({
                content: `<@${interaction.targetUser.id}> has **${resultSet.recordset[0].points}** points!`,
                ephemeral: true
            })
            .catch(process.report.writeReport))
        .catch(process.report.writeReport);
}

module.exports = { command, call: handle };
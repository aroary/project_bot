const { ContextMenuCommandBuilder, ApplicationCommandType, CommandInteraction } = require('discord.js');
const { queries, db } = require("../../utils/database");

const command = new ContextMenuCommandBuilder()
    .setName("Points")
    .setType(ApplicationCommandType.User);

/**
 * @param {CommandInteraction} interaction 
 */
function handle(interaction) {
    db
        .then(poolConnection => poolConnection
            .request()
            .query(queries
                .get("amount")
                .declare("id", interaction.member.id, "bigint")
                .compile())
            .then(resultSet => interaction
                .reply({
                    content: `<@${interaction.targetUser.id}> has **${resultSet.recordset[0].points}** points!`,
                    ephemeral: true
                })
                .catch(process.report.writeReport))
            .catch(process.report.writeReport))
        .catch(process.report.writeReport);
}

module.exports = { command, call: handle };
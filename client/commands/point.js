const {
    SlashCommandBuilder,
    CommandInteraction,
    SlashCommandSubcommandBuilder,
    SlashCommandUserOption
} = require('discord.js');
const { queries } = require("../../utils/database");

const command = new SlashCommandBuilder()
    .setName("points")
    .setDescription("Points stats")
    .addSubcommand(new SlashCommandSubcommandBuilder()
        .setName("leaders")
        .setDescription("Leader board of members with most points."))
    .addSubcommand(new SlashCommandSubcommandBuilder()
        .setName("count")
        .setDescription("Number of points for a member.")
        .addUserOption(new SlashCommandUserOption()
            .setName("member")
            .setDescription("The member.")
            .setRequired(false)))
    .addSubcommand(new SlashCommandSubcommandBuilder()
        .setName("donate")
        .setDescription("Donate a point to a friend")
        .addUserOption(new SlashCommandUserOption()
            .setName("member")
            .setDescription("The member to donate to.")
            .setRequired(true)));

/**
 * @param {CommandInteraction} interaction 
 */
function handle(interaction) {
    switch (interaction.options.getSubcommand()) {
        case "leaders":
            queries
                .get("leaderboard")
                .send()
                .then(resultSet => interaction
                    .reply({
                        content: resultSet.recordset
                            .map(record => `- <@${record.id}>: **${record.points}**`)
                            .join("\n"),
                        ephemeral: true
                    })
                    .catch(process.report.writeReport))
                .catch(process.report.writeReport);
            break;

        case "count":
            var member = interaction.options.getUser("member") || interaction.user;
            if (member.bot) interaction.reply({
                content: `<@${member.id}> has **${Infinity}** points!`,
                ephemeral: true
            });
            else queries
                .get("amount")
                .declare("id", member.id, "bigint")
                .send()
                .then(resultSet => interaction
                    .reply({
                        content: `<@${member.id}> has **${resultSet.recordset[0]?.points || 0}** points!`,
                        ephemeral: true
                    })
                    .catch(process.report.writeReport))
                .catch(process.report.writeReport);
            break;

        case "donate":
            var member = interaction.options.getUser("member");
            if (member.bot) interaction.reply({
                content: `Donated **1** point to <@${member.id}>`,
                ephemeral: true
            });
            else queries
                .get("increment")
                .declare("id", member.id, "bigint")
                .declare("points", 1, "int")
                .send()
                .then(() => interaction.reply({ content: `Donated **1** point to <@${member.id}>` }))
                .catch(process.report.writeReport);
            break;

        default:
            interaction.reply({ content: "Something whent wrong", ephemeral: true });
            break;
    }
}

module.exports = { command, call: handle };
const { Events, Message, EmbedBuilder, ChannelType } = require("discord.js");
const Webhook = require("../../utils/webhook");
const { queries } = require("../../utils/database");

/**
 * @param {Message} message
 */
function handle(message) {
    const client = require("../client");
    if (message.author.id !== client.user.id && !message.guild) {
        console.log("Client:", "Message");

        // Create data
        const embeds = [];

        message.content && embeds.push(new EmbedBuilder()
            .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })
            .setDescription(message.content)
            .setTimestamp());

        message.attachments.forEach(attachment => embeds.push(new EmbedBuilder()
            .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })
            .setImage(attachment.url)
            .setTimestamp()));

        new Webhook(process.env["DM_ID"], process.env["DM_TOKEN"])
            .post({
                username: message.author.username,
                avatar_url: message.author.avatarURL(),
                embeds: [...message.embeds, ...embeds.map(embed => embed.toJSON())]
            })
            .then(request => console.log("Webhook:", request.statusCode, request.statusMessage))
            .catch(process.report.writeReport);
    } else if ([
        process.env["CHANGELOG_ID"],
        process.env["STATUS_ID"],
        process.env["ADVISOR_ID"]
    ].includes(message.author.id)) message
        .crosspost()
        .catch(process.report.writeReport);

    // Add points
    if (!message.author.bot && message.channel.type !== ChannelType.DM) {
        var points = 1;

        if (message.channel.name.toLowerCase() === "general") points++;
        if (message.member.premiumSince) points *= 2;

        queries
            .get("increment")
            .declare("id", message.author.id, "bigint")
            .declare("points", points, "int")
            .send()
            .catch(process.report.writeReport);
    }
}

module.exports = { event: Events.MessageCreate, call: handle };
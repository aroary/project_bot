const { Events, Message, EmbedBuilder } = require("discord.js");
const Webhook = require("../../utils/webhook");

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
            .catch(console.log);
    }
}

module.exports = { event: Events.MessageCreate, call: handle };
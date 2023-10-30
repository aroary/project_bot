const { Events, Message } = require("discord.js");
const Webhook = require("../../utils/webhook");

/**
 * @param {Message} message
 */
function handle(message) {
    if (!message.guild) {
        console.log("Client:", "Message");

        // Create data
        const embeds = [];

        message.content && embeds.push(new discord.EmbedBuilder()
            .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })
            .setDescription(message.content)
            .setTimestamp());

        message.attachments.forEach(attachment => embeds.push(new discord.EmbedBuilder()
            .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })
            .setImage(attachment.url)
            .setTimestamp()));

        const webhook = new Webhook();
        webhook.id = process.env["DM_ID"];
        webhook.token = process.env["DM_TOKEN"];
        webhook.post({
            username: message.author.username,
            avatar_url: message.author.avatarURL(),
            embeds: [...message.embeds, ...embeds.map(embed => embed.toJSON())]
        })
            .then(() => console.log("Webhook:", res.statusCode, res.statusMessage))
            .catch(console.log);
    }
}

module.exports = { event: Events.MessageCreate, call: handle };
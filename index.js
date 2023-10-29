// Load configurations
require('dotenv').config();

const http = require("http");
const https = require("https");
const discord = require("discord.js");

const client = new discord.Client({
    intents: [
        discord.GatewayIntentBits.DirectMessages,
        discord.GatewayIntentBits.DirectMessageReactions,
        discord.GatewayIntentBits.Guilds,
        discord.GatewayIntentBits.GuildIntegrations,
        discord.GatewayIntentBits.GuildInvites,
        discord.GatewayIntentBits.GuildMembers,
        discord.GatewayIntentBits.GuildMessages,
        discord.GatewayIntentBits.GuildMessageReactions,
        discord.GatewayIntentBits.GuildWebhooks
    ],
    partials: [
        discord.Partials.Channel,
        discord.Partials.Message
    ]
});

client.on("ready", () => {
    // Set status
    client.user.setPresence({ activities: [{ type: "WATCHING", name: "DMs forward to staff" }], status: "online" });
});

client.on("messageCreate", message => {
    if (!message.guild) {
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


        const data = JSON.stringify({
            username: message.author.username,
            avatar_url: message.author.avatarURL(),
            embeds: [...message.embeds, ...embeds.map(embed => embed.toJSON())]
        });

        const webhook = https.request({
            method: "POST",
            host: "discord.com",
            port: "443",
            path: `/api/webhooks/${process.env["DM_ID"]}/${process.env["DM_TOKEN"]}`,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }, res => {
            res.on("end", () => console.log(res.statusCode, res.statusMessage));
            res.on("error", console.log);
        });

        // Send data
        webhook.write(data);
        webhook.end();
    }
});

// Login
client.login(process.env["BOT_TOKEN"]).then(() => console.log("Client: Online")).catch(error => console.log(error));

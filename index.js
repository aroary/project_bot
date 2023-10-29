// Load configurations
require('dotenv').config();

const http = require("http");
const https = require("https");
const discord = require("discord.js");

const server = http.createServer();

server.on("request", (req, res) => {
    console.log("Server:", "request");
    res.writeHead(302, { 'Location': 'https://discord.gg/d39DnYurrU' }).end();
});

// Listen
server.listen(Number(process.env["PORT"]) || 3000, () => console.log("Server:", "Online"));

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
    console.log("Client:", "ready");

    // Set status
    client.user.setPresence({ activities: [{ type: "WATCHING", name: "DMs forward to staff" }], status: "online" });
});

client.on("messageCreate", message => {
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
client.login(process.env["BOT_TOKEN"]).then(() => console.log("Client:", "Online")).catch(error => console.log(error));

const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits, Partials } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildWebhooks
    ],
    partials: [
        Partials.Channel,
        Partials.Message
    ]
});

// Load events
fs.readdirSync(path.join(__dirname, "./events")).filter(file => file.endsWith(".js")).forEach(file => {
    const event = require(`./events/${file}`);
    client.on(event.event, event.call);

    console.log("Client:", "Loaded", event.event);
});

// Login
client.login(process.env["BOT_TOKEN"])
    .then(() => console.log("Client:", "Online"))
    .catch(console.log);

module.exports = client;
const fs = require("fs");
const path = require("path");
const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");

class Bot extends Client {
    chatInputCommands = new Collection();
    deployment = require("./utils/deployment");
};

const client = new Bot({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
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
    const { event, call } = require(`./events/${file}`);
    client.on(event, call);

    console.log("Client:", "Loaded", event);
});

// Load commands
fs.readdirSync(path.join(__dirname, "./commands")).filter(file => file.endsWith(".js")).forEach(file => {
    const { command, call } = require(`./commands/${file}`);
    client.chatInputCommands.set(command.name, { command, call });

    console.log("Client:", "Loaded", command.name);
});

// Deploy
if (process.env["BOT_REDEPLOY"]) client.deployment.reset()
    .then(() => client.deployment.deploy(client.chatInputCommands.map(command => command.command))
        .then(() => console.log("Client:", "Deployed"))
        .catch(console.log))
    .catch(console.log())

// Login
client.login(process.env["BOT_TOKEN"])
    .then(() => console.log("Client:", "Online"))
    .catch(console.log);

module.exports = client;
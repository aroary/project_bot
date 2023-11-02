const fs = require("fs");
const path = require("path");
const {
    Client,
    Collection,
    GatewayIntentBits,
    Partials,
    SlashCommandBuilder,
    CommandInteraction
} = require("discord.js");

/**
 * @callback CommandInteractionFunction
 * @param {CommandInteraction} interaction
 * @returns {void}
 * 
 * @callback CommandAutoCompleteFunction
 * @param {CommandInteraction} interaction
 * @returns {void}
 * 
 * @typedef {Object} ClientCommand Slash command data
 * @property {SlashCommandBuilder} command
 * @property {CommandInteractionFunction} call
 * @property {CommandAutoCompleteFunction|undefined} autoComplete
 */

class Bot extends Client {
    /**
     * @type {Collection<string,ClientCommand>}
     */
    commands = new Collection();

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
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildMessageTyping
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User
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
    /**
     * @type {ClientCommand}
     */
    const data = require(`./commands/${file}`);

    client.commands.set(data.command.name, data);

    console.log("Client:", "Loaded", data.command.name);
});

// Login or Deploy
if (process.argv.includes("--deploy")) client.deployment.reset()
    .then(() => client.deployment.deploy(client.commands.map(command => command.command))
        .then(() => console.log("Client:", "Deployed"))
        .catch(process.report.writeReport))
    .catch(process.report.writeReport);
else client.login(process.env["BOT_TOKEN"])
    .then(() => console.log("Client:", "Online"))
    .catch(process.report.writeReport);

module.exports = client;
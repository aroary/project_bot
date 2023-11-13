const fs = require("fs");
const path = require("path");
const { Client, Collection, GatewayIntentBits, Partials, SlashCommandBuilder, ButtonBuilder } = require("discord.js");

/**
 * @callback CommandInteractionFunction
 * @param {CommandInteraction} interaction
 * @returns {void}
 * 
 * @callback CommandAutoCompleteFunction
 * @param {CommandInteraction} interaction
 * @returns {void}
 * 
 * @callback CommandButtonFunction
 * @param {CommandInteraction} interaction
 * @returns {void}
 * 
 * @typedef {Object} ClientCommand Slash command data
 * @property {SlashCommandBuilder} command
 * @property {CommandInteractionFunction} call
 * @property {CommandAutoCompleteFunction|undefined} autoComplete
 * 
 * @typedef {Object} ClientButton Slash command data
 * @property {ButtonBuilder} button
 * @property {CommandInteractionFunction} call
 */

class Bot extends Client {
    /**
     * @type {Collection<string,ClientCommand>}
     */
    commands = new Collection();

    /**
     * @type {Collection<string,ClientButton>}
     */
    buttons = new Collection();
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
fs
    .readdirSync(path.join(__dirname, "./events"))
    .filter(file => file.endsWith(".js"))
    .forEach(file => {
        const { event, call } = require(`./events/${file}`);
        client.on(event, call);

        console.log("Client:", "Loaded", event);
    });

// Load commands
fs
    .readdirSync(path.join(__dirname, "./commands"))
    .filter(file => file.endsWith(".js"))
    .forEach(file => {
        /**
         * @type {ClientCommand}
         */
        const data = require(`./commands/${file}`);

        client.commands.set(data.command.name, data);

        console.log("Client:", "Loaded", data.command.name);
    });

// Load buttons
fs
    .readdirSync(path.join(__dirname, "./buttons"))
    .filter(file => file.endsWith(".js"))
    .forEach(file => {
        /**
         * @type {ClientButton}
         */
        const data = require(`./buttons/${file}`);

        client.buttons.set(data.button.data.custom_id, data);

        console.log("Client:", "Loaded", data.button.data.custom_id);
    });

// Login
client.login(process.env["BOT_TOKEN"])
    .then(() => console.log("Client:", "Online"))
    .catch(process.report.writeReport);

module.exports = client;
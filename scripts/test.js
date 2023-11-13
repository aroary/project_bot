const assert = require("assert");
const fs = require("fs");
const path = require("path");
const {
    SlashCommandBuilder,
    ContextMenuCommandBuilder,
    Events
} = require("discord.js");

// Test commands
fs
    .readdirSync(path.join(__dirname, "../client/commands"))
    .filter(file => file.endsWith(".js"))
    .map(file => ({
        name: file,
        value: require(path.join(__dirname, "../client/commands/", file))
    }))
    .forEach(file => {
        const { name, value } = file;

        console.log(name);

        assert(value.command instanceof SlashCommandBuilder || value.command instanceof ContextMenuCommandBuilder, name);
        assert(typeof value.call === "function", name);
    });

// Test events
fs
    .readdirSync(path.join(__dirname, "../client/events"))
    .filter(file => file.endsWith(".js"))
    .map(file => ({
        name: file,
        value: require(path.join(__dirname, "../client/events/", file))
    }))
    .forEach(file => {
        const { name, value } = file;

        console.log(name);

        assert(Object.values(Events).includes(value.event), name);
        assert(typeof value.call === "function", name);
    });

// Test routs
fs
    .readdirSync(path.join(__dirname, "../server/routs"))
    .filter(file => file.endsWith(".js"))
    .map(file => ({
        name: file,
        value: require(path.join(__dirname, "../server/routs/", file))
    }))
    .forEach(file => {
        const { name, value } = file;

        console.log(name);

        assert(value.methods.length, name);
        assert(value.routs.length, name);
        assert(typeof value.call === "function", name);
    });

const env = {
    ...process.env,
    ...require('dotenv').parse(fs.readFileSync(path.join(__dirname, "../.env")))
};

// assert(env["PORT"], "PORT not configured.");
assert(env["BOT_TOKEN"], "BOT_TOKEN not configured.");
assert(env["BOT_APP_ID"], "BOT_APP_ID not configured.");
assert(env["BOT_PUBLIC_KEY"], "BOT_PUBLIC_KEY not configured.");
assert(env["BOT_CLIENT_SECRET"], "BOT_CLIENT_SECRET not configured.");
assert(env["DM_ID"], "DM_ID not configured.");
assert(env["DM_TOKEN"], "DM_TOKEN not configured.");
assert(env["CHANGELOG_ID"], "CHANGELOG_ID not configured.");
assert(env["CHANGELOG_TOKEN"], "CHANGELOG_TOKEN not configured.");
assert(env["STATUS_ID"], "STATUS_ID not configured.");
assert(env["STATUS_TOKEN"], "STATUS_TOKEN not configured.");
assert(env["ADVISOR_ID"], "ADVISOR_ID not configured.");
assert(env["ADVISOR_TOKEN"], "ADVISOR_TOKEN not configured.");
assert(env["SERVER_ID"], "SERVER_ID not configured.");
assert(env["REPOSITORIES_CHANNEL_ID"], "REPOSITORIES_CHANNEL_ID not configured.");
// assert(env["GENERAL_CHANNEL_ID"], "GENERAL_CHANNEL_ID not configured.");
// assert(env["BOOSTER_ROLE_ID"], "BOOSTER_ROLE_ID not configured.");
// assert(env["OPENAI_API_KEY"], "ADVISOR_TOKEN not configured.");
assert(env["DB_USERNAME"], "DB_USERNAME not configured.");
assert(env["DB_PASSWORD"], "DB_PASSWORD not configured.");
assert(env["DB_SERVER"], "DB_SERVER not configured.");
assert(env["DB_PORT"], "DB_PORT not configured.");
assert(env["DB_NAME"], "DB_NAME not configured.");

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
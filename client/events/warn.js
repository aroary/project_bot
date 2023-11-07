const { Events } = require("discord.js");

/**
 * @param {string} warn
 */
function handle(warn) {
    console.warn(warn);
}

module.exports = { event: Events.Warn, call: handle };
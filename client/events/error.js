const { Events } = require("discord.js");

/**
 * @param {Error} error
 */
function handle(error) {
    console.error(error);
}

module.exports = { event: Events.Error, call: handle };
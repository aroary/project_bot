const { Events, Typing } = require("discord.js");

/**
 * @param {Typing} typing
 */
function handle(typing) {
    if (!typing.guild) typing.channel.sendTyping();
}

module.exports = { event: Events.TypingStart, call: handle };
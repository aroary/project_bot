const { Events, Typing, ActivityType } = require("discord.js");

var delay;
var last;

/**
 * @param {Typing} typing
 */
function handle(typing) {
    if (typing.user.id !== last) {
    const client = require("../client");

    client.user.setPresence({
        activities: [{ type: ActivityType.Watching, name: typing.user.username }],
        status: "online",
    });

    if (!delay) delay = setTimeout(() => client.user.setPresence({
        activities: [{ type: ActivityType.Watching, name: "DMs forward to staff" }],
        status: "idle",
    }), 10000);
    else delay.refresh();

        last = typing.user.id;
    }
}

module.exports = { event: Events.TypingStart, call: handle };
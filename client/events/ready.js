const { Events, ActivityType } = require("discord.js");

function handle() {
    const client = require("../client");

    // Set status
    client.user.setPresence({
        activities: [{ type: ActivityType.Watching, name: "DMs forward to staff" }],
        status: "online",
    });

    console.log("Client:", "ready");
}

module.exports = { event: Events.ClientReady, call: handle };
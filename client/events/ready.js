const { ActivityType } = require("discord.js");
const client = require("../client");

function handle() {
    console.log("Client:", "ready");

    // Set status
    client.user.setPresence({
        activities: [{ type: ActivityType.Watching, name: "DMs forward to staff" }],
        status: "online",
    });
}

module.exports = { event: "ready", call: handle };
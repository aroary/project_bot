const { Events, ActivityType } = require("discord.js");

function handle() {
    const client = require("../client");

    // Set status
    client.user.setPresence({
        activities: [{ type: ActivityType.Watching, name: "DMs forward to staff" }],
        status: "idle",
    });

    // Start trending timer
    const trending = require("../utils/trending");
    trending()
        .then(interval => interval.unref())
        .catch(process.report.writeReport)

    console.log("Client:", "ready");
}

module.exports = { event: Events.ClientReady, call: handle };
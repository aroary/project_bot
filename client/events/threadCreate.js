const { Events, ThreadChannel, ChannelType } = require("discord.js");

/**
 * @param {ThreadChannel} thread
 */
function handle(thread) {
    if (thread.type === ChannelType.PublicThread && thread.parentId === process.env["REPOSITORIES_CHANNEL_ID"]) {
        // Refresh threading timer
    }
}

module.exports = { event: Events.ThreadCreate, call: handle };
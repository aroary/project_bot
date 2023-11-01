const { Events, ThreadChannel, ChannelType } = require("discord.js");
const trending = require("../utils/trending");

/**
 * @param {ThreadChannel} thread
 */
function handle(thread) {
    if (thread.type === ChannelType.PublicThread) {
        // Refresh threading timer
        trending.refresh();
    }
}

module.exports = { event: Events.ThreadCreate, call: handle };
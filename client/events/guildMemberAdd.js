const { Events, GuildMember, ActionRowBuilder } = require("discord.js");

const buttons = new ActionRowBuilder().addComponents(require("../buttons/point").button);
const disabled = structuredClone(buttons);

disabled.components.forEach(component => console.log(component));

/**
 * @param {GuildMember} member
 */
function handle(member) {
    require("../client").channels.cache.get("941519180719603712")/*.guilds.cache
        .get(process.env["SERVER_ID"]).channels.cache
        .find(channel => channel.name.toLowerCase() === "general")*/
        .send({
            content: `Welcome ${member.displayName} \\👋`,
            components: [buttons]
        })
        .then(message => setTimeout(() => message
            .edit({
                content: `Welcome ${member.displayName} \\👋`,
                components: [disabled]
            })
            .catch(process.report.writeReport), 600000))
        .catch(process.report.writeReport);
}

module.exports = { event: Events.ClientReady /*GuildMemberAdd*/, call: handle };
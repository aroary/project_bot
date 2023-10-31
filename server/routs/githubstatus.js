const { ClientRequest, ServerResponse } = require("http");
const { EmbedBuilder } = require("discord.js");
const Webhook = require("../../utils/webhook");

/**
 * @param {ClientRequest} req
 * @param {ServerResponse} res
 */
function handle(req, res) {
    try {
        var body = [];
        req
            .on('data', chunk => body.push(chunk))
            .on('end', () => body = JSON.parse(Buffer.concat(body).toString()))
            .on("error", console.log);

        const embed = new EmbedBuilder()
            .setTitle(body.component.name)
            .setDescription(body.page.status_description)
            .setURL(`https://www.githubstatus.com/incidents/${body.page.id}`)
            .addFields(
                { name: "Old Status", value: body.component_update.old_status.replace("_", " "), inline: false },
                { name: "New Status", value: body.component_update.new_status.replace("_", " "), inline: false }
            )
            .setColor({ none: "#28a746", minor: "#dbab09", major: "#e36209", critical: "#dc3546" }[body.page.status_indicator])
            .setTimestamp();

        new Webhook(process.env["STATUS_ID"], process.env["STATUS_TOKEN"])
            .post({ embeds: [embed.toJSON()] })
            .then(request => console.log("Webhook:", request.statusCode, request.statusMessage))
            .catch(console.log);

    } catch (error) {
        console.log(error);
    } finally {
        res.writeHead(200, ":)").end();
    }
}

module.exports = { methods: ["GET", "POST"], routs: ["/githubstatus"], call: handle };
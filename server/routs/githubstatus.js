const { ClientRequest, ServerResponse } = require("http");
const { EmbedBuilder } = require("discord.js");
const Webhook = require("../../utils/webhook");

/**
 * @param {ClientRequest} req
 * @param {ServerResponse} res
 */
function handle(req, res) {
    try {
        new Promise((resolve, reject) => {
            var body = [];
            req
                .on('data', chunk => body.push(chunk, console.log(chunk)))
                .on('end', () => resolve(JSON.parse(Buffer.concat(body).toString())))
                .on("error", reject);
        })
            .then(body => new Webhook(process.env["STATUS_ID"], process.env["STATUS_TOKEN"])
                .post({
                    embeds: [new EmbedBuilder()
                        .setTitle(body.component.name)
                        .setDescription(body.page.status_description)
                        .setURL(`https://www.githubstatus.com/incidents/${body.page.id}`)
                        .addFields(
                            {
                                name: "Old Status",
                                value: body.component_update.old_status.replace("_", " "),
                                inline: true
                            },
                            {
                                name: "New Status",
                                value: body.component_update.new_status.replace("_", " "),
                                inline: true
                            }
                        )
                        .setColor({ none: "#28a746", minor: "#dbab09", major: "#e36209", critical: "#dc3546" }[body.page.status_indicator])
                        .setTimestamp()
                        .toJSON()]
                })
                .then(request => console.log("Webhook:", request.statusCode, request.statusMessage))
                .catch(process.report.writeReport))
            .catch(process.report.writeReport);
    } catch (error) {
        process.report.writeReport(error);
    } finally {
        res.writeHead(200, ":)").end();
    }
}

module.exports = { methods: ["GET", "POST"], routs: ["/githubstatus"], call: handle };
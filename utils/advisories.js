const { EmbedBuilder } = require("discord.js");
const { request } = require("@octokit/request");
const Webhook = require("./webhook");

var published = new Set();

/**
 * @description Start watching advisories
 * @returns {Promise<NodeJS.Timer,Error>}
 */
function initiate() {
    return new Promise((resolve, reject) => request("GET /advisories")
        .then(response => {
            published = new Set(response.data.map(item => item.ghsa_id));

            resolve(setInterval(() => request("GET /advisories")
                .then(res => {
                    res.data
                        .filter(item => !published.has(item.ghsa_id))
                        .reverse()
                        .map(item => new EmbedBuilder()
                            .setTitle(item.summary)
                            .setDescription(item.description.slice(0, 1500))
                            .setURL(item.html_url)
                            .setAuthor({
                                name: item.credits?.[0]?.user?.login || "GitHub",
                                iconURL: item.credits?.[0]?.user?.avatar_url || "https://avatars.githubusercontent.com/u/9919"
                            })
                            .setColor(({ high: "Red", medium: "Orange", low: "Yellow" })[item.severity] || "NotQuiteBlack")
                            .setFooter({ text: item.published_at }))
                        .forEach((item, i) => setTimeout(() => new Webhook(process.env["ADVISOR_ID"], process.env["ADVISOR_TOKEN"])
                            .post({ embeds: [item] })
                            .then(request => console.log("Webhook:", request.statusCode, request.statusMessage))
                            .catch(process.report.writeReport), i * 5000));

                    res.data.forEach(item => published.add(item.ghsa_id));

                    if (published.size > 60) published = new Set([...published].slice(30))
                })
                .catch(process.report.writeReport), 300000 /* five minutes */));
        })
        .catch(reject));
}

module.exports = initiate;
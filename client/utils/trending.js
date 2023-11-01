/**
 * @file Post trending repositories
 */

const { request } = require("@octokit/request");
const { ThreadAutoArchiveDuration } = require("discord.js");

const interval = setInterval(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);

    request("GET /search/repositories", {
        q: `created:${date.toISOString().split('T')[0]} language:${["JavaScript", "HTML", "Java", "C++", "C", "Python", "C#"][Math.floor(Math.random() * 7)]}`,
        sort: "stars",
        per_page: 50
    })
        .then(response => {
            const client = require("../client");

            const repository = response.data.items[Math.floor(Math.random() * response.data.items.length)];

            client.channels.cache.get(process.env["REPOSITORIES_CHANNEL_ID"]).threads.create({
                name: repository.name,
                autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
                message: { content: `${repository.description || ""}\n\n${repository.html_url}`.trimStart() },
                reason: "Activity"
            });
        })
        .catch(process.report.writeReport);
}, 3600000 /* one hour */);

interval.unref();

module.exports = interval;
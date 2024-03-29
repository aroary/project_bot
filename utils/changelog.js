const https = require("https");
const { EmbedBuilder } = require("discord.js");
const { parseStringPromise } = require('xml2js');
const { NodeHtmlMarkdown } = require("node-html-markdown");
const Webhook = require("./webhook");

function rss(url) {
    return new Promise((resolve, reject) => https.get(url, response => {
        var data = "";
        response
            .on("data", d => data += d)
            .on("error", reject)
            .on("end", () => parseStringPromise(data)
                .then(resolve)
                .catch(reject));
    })
        .on("error", reject)
        .end());
}

class GitHubBlogItem {
    constructor (item) {
        this["title"] = item["title"][0];
        this["link"] = item["link"][0];
        this["dc:creator"] = item["dc:creator"][0];
        this["pubDate"] = item["pubDate"][0];
        this["guid"] = item["guid"][0];
        this["description"] = item["description"][0];
        this["content:encoded"] = item["content:encoded"][0];
        this["post-id"] = item["post-id"][0];
    }
}

class GitHubBlogChannel {
    constructor (channel) {
        this["title"] = channel["title"][0];
        this["atom:link"] = { ...channel["atom:link"][0]["$"] };
        this["link"] = channel["link"][0];
        this["description"] = channel["description"][0];
        this["lastBuildDate"] = channel["lastBuildDate"][0];
        this["language"] = channel["language"][0];
        this["sy:updatePeriod"] = channel["sy:updatePeriod"][0];
        this["sy:updateFrequency"] = channel["sy:updateFrequency"][0];
        this["generator"] = channel["generator"][0];
        this["image"] = {
            "url": channel["image"][0]["url"][0],
            "title": channel["image"][0]["title"][0],
            "link": channel["image"][0]["link"][0],
            "width": channel["image"][0]["width"][0],
            "height": channel["image"][0]["height"][0]
        };
        this["site"] = channel["site"][0];
        this["item"] = channel["item"].map(item => new GitHubBlogItem(item));
    };
};

class GitHubBlog {
    /**
     * @param {string} url - The blog rss endpoint
     * @returns {Promise<GitHubBlog>}
     */
    load(url) {
        return new Promise((resolve, reject) => rss(url)
            .then(data => {
                this.json = data.rss;
                resolve(this);
            })
            .catch(reject));
    }

    /**
     * @description Get information about the feed.
     * @returns {{"version":string}}
     */
    meta() {
        return this.json["$"];
    }

    /**
     * @returns {[GitHubBlogItem]}
     */
    items() {
        return this.json["channel"][0]["item"].map(item => new GitHubBlogItem(item));
    }

    /**
     * @returns {GitHubBlogChannel}
     */
    channel() {
        return new GitHubBlogChannel(this.json["channel"][0]);
    }
};

var latest = null;

/**
 * @description Start watching changelog
 * @returns {Promise<NodeJS.Timer,Error>}
 */
function initiate() {
    return new Promise((resolve, reject) => new GitHubBlog()
        .load("https://github.blog/changelog/feed/")
        .then(blog => {
            latest = blog.items()[0]["post-id"]["_"];

            resolve(setInterval(() => new GitHubBlog()
                .load("https://github.blog/changelog/feed/")
                .then(blog => {
                    const items = blog.items();

                    // Find place
                    var index = items.findIndex(item => item["post-id"]["_"] === latest);
                    if (index < 0) index = items.length;

                    if (index) items
                        .slice(0, index)
                        .reverse()
                        .map(item => new EmbedBuilder()
                            .setTitle(item["title"])
                            .setDescription(NodeHtmlMarkdown.translate(item["description"], {
                                bulletMarker: "-",
                                maxConsecutiveNewlines: 1,
                                keepDataImages: false,
                                useLinkReferenceDefinitions: false,
                                useInlineLinks: true
                            }))
                            .setURL(item["link"])
                            .setAuthor({ name: item["dc:creator"] })
                            .setFooter({ text: item["pubDate"] }))
                        .forEach(item => new Webhook(process.env["CHANGELOG_ID"], process.env["CHANGELOG_TOKEN"])
                            .post({ embeds: [item] })
                            .then(request => console.log("Webhook:", request.statusCode, request.statusMessage))
                            .catch(process.report.writeReport));

                    latest = items[0]["post-id"]["_"];
                })
                .catch(process.report.writeReport), 300000 /* five minutes */));
        })
        .catch(reject));
}

module.exports = initiate;
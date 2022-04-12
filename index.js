const discord = require("discord.js");
const request = require('request');
const jsonFormat = require("json-format");
const { Octokit } = require("@octokit/core");

const octokit = new Octokit();
const secrets = JSON.parse(require("fs").readFileSync("./settings.json"));
const client = new discord.Client({ intents: secrets.intents, partials: ['CHANNEL'] });
client.online = false;
client.deployed = false;

const commands = [
    {
        name: "get",
        description: "Get information from GitHub",
        defaultPermission: true,
        options: [
            { name: "path", type: "STRING", description: "The method and path of the request", required: true },
            { name: "param1", type: "STRING", description: "The first parameter for the PATH", required: false },
            { name: "param2", type: "STRING", description: "The second parameter for the PATH", required: false },
            { name: "param3", type: "STRING", description: "The third parameter for the PATH", required: false },
            { name: "param4", type: "STRING", description: "The fourth parameter for the PATH", required: false }
        ]
    }
];

client.on("ready", () => {
    commands.forEach(command => {
        client.application?.commands.create(command);
    });

    client.user.setPresence({ activities: [{ type: "WATCHING", name: "DMs forward to staff" }], status: "online" });
});

client.on("messageCreate", message => {
    if (!message.guild) {
        if (message.content) request.post({
            url: secrets.dm,
            method: "POST",
            json: true,
            body: {
                username: message.author.username,
                avatar_url: message.author.avatarURL(),
                content: message.content,
                embeds: [...message.embeds]
            }
        }, (error, response, body) => error && console.log(error, response, body));

        message.attachments.forEach(attachment => {
            request.post({
                url: process.env['webhook'],
                method: "POST",
                json: true,
                body: {
                    username: message.author.username,
                    avatar_url: message.author.avatarURL(),
                    content: attachment.url,
                    embeds: []
                }
            }, (error, response, body) => error && console.log(error, response, body));
        });
    };

    if (["936354671747018782", "935632814324465686", "955164006446952508", "955164131844051077"].includes(message.channel.id)) {
        message.startThread({
            name: message.content.split` `.fiter(word => {
                try {
                    return new URL(word).host === "github.com";
                } catch (_) {
                    return false;
                };
            })[0].replace("https://github.com/"),
            autoArchiveDuration: 60,
            reason: 'Chat about this repository!',
        });
    };
});

client.on("messageEdit", (oldMessage, newMessage) => {
    const data = newMessage.content.split` `;
    const urls = data.filter(item => item.startsWith("http://") || item.startsWith("https://"));

    if (newMessage.channel.id === "935632814324465686") { // repository
        if (data.length > 20) return newMessage.delete("description too long");
        if (urls.length !== 1) return newMessage.delete("wrong number of urls");

        const url = new URL(urls[0]), path = url.pathname.split`/`;
        if (url.origin === "https://github.com" && path.length === 3) {
            octokit.request("GET /repos/{owner}/{repo}", {
                owner: path[1],
                repo: path[2]
            }).then(repo => {
                if (repo.status < 200 || repo.status >= 300) newMessage.delete("invalid repository");
            }).catch(() => newMessage.delete("invalid repository"));
        } else newMessage.delete("invalid url");
    } else if (newMessage.channel.id === "955166306628423690") { // commit
        if (data.length > 10) return newMessage.delete("description too long");
        if (urls.length !== 1) return newMessage.delete("wrong number of urls");

        const url = new URL(urls[0]), path = url.pathname.split`/`;
        if (url.origin === "https://github.com" && path.length === 4) {
            octokit.request("GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head", {
                owner: path[1],
                repo: path[2],
                commit_sha: path[4]
            }).then(repo => {
                if (repo.status < 200 || repo.status >= 300) newMessage.delete("invalid commit");
            }).catch(() => newMessage.delete("invalid commit"));
        } else newMessage.delete("invalid url");
    } else if (newMessage.channel.id === "955164006446952508") { // issue
        if (data.length > 10) return newMessage.delete("description too long");
        if (urls.length !== 1) return newMessage.delete("wrong number of urls");

        const url = new URL(urls[0]), path = url.pathname.split`/`;
        if (url.origin === "https://github.com" && path.length === 4) {
            octokit.request("GET /repos/{owner}/{repo}/issues/{issue_number}", {
                owner: path[1],
                repo: path[2],
                issue_number: path[4]
            }).then(issue => {
                if (issue.status < 200 || issue.status >= 300) newMessage.delete("invalid issue");
            }).catch(() => newMessage.delete("invalid issue"));
        } else newMessage.delete("invalid url");
    } else if (newMessage.channel.id === "955164131844051077") { // pull-request
        if (data.length > 10) return newMessage.delete("description too long");
        if (urls.length !== 1) return newMessage.delete("wrong number of urls");

        const url = new URL(urls[0]), path = url.pathname.split`/`;
        if (url.origin === "https://github.com" && path.length === 4) {
            octokit.request("GET /repos/{owner}/{repo}/pulls/{pull_number}", {
                owner: path[1],
                repo: path[2],
                pull_number: path[4]
            }).then(pr => {
                if (pr.status < 200 || pr.status >= 300) newMessage.delete("invalid pull-request");
            }).catch(() => newMessage.delete("invalid pull-request"));
        } else newMessage.delete("invalid url");
    } else if (newMessage.channel.id === "936354671747018782") { // gist
        if (data.length > 10) return newMessage.delete("description too long");
        if (urls.length !== 1) return newMessage.delete("wrong number of urls");

        const url = new URL(urls[0]), path = url.pathname.split`/`;
        if (url.origin === "https://gist.github.com" && path.length) {
            octokit.request("GET /gists/{gist_id}", {
                gist_id: url[2]
            }).then(repo => {
                if (repo.status < 200 || repo.status >= 300) newMessage.delete("invalid gist");
            }).catch(() => newMessage.delete("invalid gist"));
        } else newMessage.delete("invalid url");
    };
});

client.on("interactionCreate", interaction => {
    if (interaction.isCommand()) {
        if (interaction.commandName === "get") {
            const path = interaction.options.getString("path");
            const parameters = [
                interaction.options.getString("param1"),
                interaction.options.getString("param2"),
                interaction.options.getString("param3"),
                interaction.options.getString("param4")
            ].filter(param => param);
            if (parameters.every(param => path.includes(`{${param.split(/=/).shift()}}`))) {
                console.log(path, parameters);

                const data = {};
                parameters.map(param => param.split(/=/)).forEach(param => data[param[0]] = param[1]);
                octokit
                    .request(path, data)
                    .then(info => {
						const formatted = jsonFormat(info.data, { type: 'space', size: 2 })

						if (formatted.length + 14 < 2000) interaction.reply("```json\n" + formatted + "\n```")
						else interaction.reply({ files: [{ attachment: Buffer.from(formatted, "utf-8"), name: path + ".json" }] })
					})
                    .catch(error => interaction.reply({ content: "```txt\n" + error + "\n```", ephemeral: true }));
            } else interaction.reply({
                ephemeral: true,
                embeds: [new discord.MessageEmbed().setTitle("Invalid parameters").setDescription("```json\n" + JSON.stringify({ path, parameters }) + "\n```").setTimestamp()]
            });
        };
    };
});

client.login(secrets.token).then(() => client.online = true).catch(error => console.log(error));

require("./server")(3000);
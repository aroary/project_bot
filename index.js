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
        name: "ping",
        description: "Get the latency of the bot",
        defaultPermission: true
    },
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

    if (message.channel.id === "963540278126469130") message.startThread({name: message.author.username, autoArchiveDuration: 60 });
});

client.on("interactionCreate", interaction => {
    if (interaction.isCommand()) {
        if (interaction.commandName === "get"){
            interaction.reply({ content: "Pong!", fetchReply: true }).then(msg => {
                interaction.editReply({ content: `Bot Latency: \`${msg.createdTimestamp - interaction.createdTimestamp}ms\`\nWebSocket Latency: \`${client.ws.ping}ms\``});
            });
        } else if(interaction.commandName === "get") {
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
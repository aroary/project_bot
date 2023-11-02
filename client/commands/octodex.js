const https = require("https");
const { SlashCommandBuilder, CommandInteraction, SlashCommandStringOption } = require('discord.js');
const { parseStringPromise } = require('xml2js');
const { NodeHtmlMarkdown } = require("node-html-markdown");

/**
 * @type {[{title:string,content:string}]}
 */
var choices = [];

new Promise((resolve, reject) => https.get("https://octodex.github.com/atom.xml", response => {
    var data = "";
    response
        .on("data", d => data += d)
        .on("error", reject)
        .on("end", () => parseStringPromise(data)
            .then(resolve)
            .catch(reject));
})
    .on("error", reject)
    .end())
    .then(data => choices = data.feed.entry.map(entry => ({
        title: entry["title"][0]["_"],
        content: /https:\/\/octodex\.github\.com\/images\/[\w-\.]+/.exec(entry["content"][0]["_"])[0]
    })))
    .catch(process.report.writeReport);

const command = new SlashCommandBuilder()
    .setName("octodex")
    .setDescription("art from the actodex")
    .addStringOption(new SlashCommandStringOption()
        .setName("id")
        .setDescription("art to retrieve")
        .setRequired(true)
        .setAutocomplete(true));

/**
 * @param {CommandInteraction} interaction 
 */
function handle(interaction) {
    const id = interaction.options.getString("id");
    const art = choices.find(choice => id === choice.content || id === choice.title);
    if (art) interaction
        .reply({ content: art })
        .catch(process.report.writeReport);
    else interaction
        .reply({ content: id, ephemeral: true })
        .catch(process.report.writeReport);
}

/**
 * @param {CommandInteraction} interaction
 */
function autoComplete(interaction) {
    const focused = interaction.options.getFocused();

    if (true) interaction.respond(choices
        .filter(choice => choice.title.toLowerCase().includes(focused.toLowerCase()))
        .slice(0, 24)
        .map(choice => ({ name: choice.title, value: choice.content })));
    else interaction.respond([]);
}

module.exports = { command, call: handle, autoComplete };
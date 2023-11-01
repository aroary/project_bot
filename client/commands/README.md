# Commands
#### Template
```js
const { SlashCommandBuilder, CommandInteraction } = require('discord.js');

const command = new SlashCommandBuilder();

/**
 * @param {CommandInteraction} interaction 
 */
function handle(interaction) {
    // Code
}

module.exports = { command, call: handle };
```
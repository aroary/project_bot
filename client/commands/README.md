# Commands
#### Slash Command Template
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
#### Context Menu Command Template
```js
const { ContextMenuCommandBuilder, ApplicationCommandType, CommandInteraction } = require('discord.js');

const command = new ContextMenuCommandBuilder();

/**
 * @param {CommandInteraction} interaction 
 */
function handle(interaction) {
    // Code
}

module.exports = { command, call: handle };
```
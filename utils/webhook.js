const https = require("https");
const { Embed } = require("discord.js");

class Webhook {
    constructor (url = "") {
        this.data = {};
        if (url) {
            this.id = /\/\d{18,}\//.exec(url).slice(1, -1);
            this.token = /[\w\-]{64,}/.exec(url);
        }

        this.request = https.request({
            method: "POST",
            host: "discord.com",
            port: "443",
            path: `/api/webhooks/${this.id}/${this.token}`,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    /**
     * @param {{username?:string,avatar_url?:string,message?:string,embeds?:[Embed]}|null} data
     */
    post(data) {
        data = JSON.stringify(data || this.data);

        return new Promise((resolve, reject) => {
            console.log(data);
            this.request.setHeader('Content-Length', data.length);

            this.request.on("response", resolve);
            this.request.on("error", reject);

            // Send data
            this.request.write(data);
            this.request.end();
        });
    }
}

module.exports = Webhook;
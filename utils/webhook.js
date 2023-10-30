const http = require("http");
const https = require("https");
const { Embed } = require("discord.js");

class Webhook {
    constructor (id, token) {
        this.id = id;
        this.token = token;
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
     * @returns {Promise<http.IncomingMessage>}
     */
    post(data) {
        data = JSON.stringify(data);

        return new Promise((resolve, reject) => {
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
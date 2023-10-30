const https = require("https");
const { Embed } = require("discord.js");

class Webhook {
    constructor (url = "") {
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
     * @param {string} id
     */
    set id(id) {
        this.id = id;
        if (this.url) this.url = this.url.replace(/\/\d{18,}\//, `/${id}/`);
    }

    /**
     * @param {string} token
     */
    set token(token) {
        this.token = token;
        if (this.url) this.url = this.url.replace(/[\w\-]{64,}/, token);
    }

    /**
     * @param {{username?:string,avatar_url?:string,message?:string,embeds?:[Embed]}} data
     */
    set data(data) {
        this.data.username = data.username;
        this.data.avatar_url = data.avatar_url;
        this.data.message = data.message;
        this.data.embeds = data.embeds;
    }

    /**
     * @param {{username?:string,avatar_url?:string,message?:string,embeds?:[Embed]}|null} data
     */
    post(data) {
        if (data) this.data = data;

        data = JSON.stringify(this.data);

        return new Promise((resolve, reject) => {
            this.request.setHeader('Content-Length', data.length);

            this.request.on("finish", resolve);
            this.request.on("error", reject);

            // Send data
            this.request.write(data);
            this.request.end();
        });
    }
}

module.exports = Webhook;
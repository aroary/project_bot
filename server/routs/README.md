# Routs
#### Template
```js
const { ClientRequest, ServerResponse } = require("http");

/**
 * @param {ClientRequest} req
 * @param {ServerResponse} res
 */
function handle(req, res) {
    // Code
}

module.exports = { methods: ["GET", "POST", "PUT", "DELETE"], routs: ["/"], call: handle };
```
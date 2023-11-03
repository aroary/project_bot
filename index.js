// Set report configuration
require("./utils/error")();

// Load enviroment configurations
require('dotenv').config();

// Start server
const server = require("./server/server");

// Start client
const client = require("./client/client");

// Start advisories feed
require("./utils/advisories")()
    .then(interval => interval.unref())
    .catch(process.report.writeReport);

// Start changelog feed
require("./utils/changelog")()
    .then(interval => interval.unref())
    .catch(process.report.writeReport);

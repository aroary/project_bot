// Load configurations
require('dotenv').config();

const fs = require("fs");

// Set error report directory
fs.mkdirSync("./logs", { recursive: true });
for (const file of fs.readdirSync("./logs")) fs.unlinkSync("./logs/" + file);
process.report.directory = "./logs";
process.report.reportOnFatalError = true;
process.report.reportOnSignal = true;
process.report.reportOnUncaughtException = true;

// Start server
const server = require("./server/server");

// Start client
const client = require("./client/client");

// Start advisories feed
const advisories = require("./utils/advisories");
advisories()
    .then(interval => interval.unref())
    .catch(process.report.writeReport);

// Start changelog feed
const changelog = require("./utils/changelog");
changelog()
    .then(interval => interval.unref())
    .catch(process.report.writeReport);

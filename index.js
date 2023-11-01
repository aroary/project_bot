// Load configurations
require('dotenv').config();

// Start server
const server = require("./server/server");

// Start client
const client = require("./client/client");

// Start RSS feed
const { track } = require("./utils/rss");
track();
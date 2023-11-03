const fs = require("fs");
const path = require("path");

/**
 * @description Initialize error repots configuration
 * @param {string} dir - The directory for error reports
 */
function configure(dir = path.join(__dirname, "../logs/")) {
    // Initialize directory
    fs.mkdirSync(dir, { recursive: true });
    for (const file of fs.readdirSync(dir)) fs.unlinkSync(path.join(dir, file));

    process.report.directory = dir;
    process.report.reportOnFatalError = true;
    process.report.reportOnSignal = true;
    process.report.reportOnUncaughtException = true;

    return process.report;
}

module.exports = configure;
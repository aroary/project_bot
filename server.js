const express = require('express');
const app = express();

app.get('/', (req, res) =>res.send('project'));

module.exports = (port) => app.listen(process.env.PORT || port);
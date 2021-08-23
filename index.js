const express = require("express");
const logger = require("./startup/logging");
const app = express();

require("./startup/logging");
require("./startup/db")();
require("./startup/route")(app);
require("./startup/config")(app);
require("./startup/validation")();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  logger.info(`Listening at port ${port}.....`);
});

module.exports = server;

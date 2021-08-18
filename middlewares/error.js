const { transports } = require("winston");
const { logger } = require("../log/logger");

module.exports = function (err, req, res) {
  logger.log({
    level: "error",
    message: err.message,
  });
  res.status(500).send(err.message);
};

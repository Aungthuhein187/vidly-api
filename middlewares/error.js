const { transports } = require("winston");
const { logger } = require("../log/logger");

module.exports = function (err, req, res, next) {
  logger.log({
    level: "error",
    message: err.message,
  });
  res.status(500).send("Something wrong! Try again later.");
};

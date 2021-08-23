const logger = require("../startup/logging");

module.exports = function (err, req, res, next) {
  logger.log({ level: "info", message: err.message, err });

  res.status(500).send(err.message);
};

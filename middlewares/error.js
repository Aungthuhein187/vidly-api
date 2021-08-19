const winston = require("winston");

module.exports = function (err, req, res) {
  winston.log({
    level: "error",
    message: err.message,
  });
  res.status(500).send(err.message);
};

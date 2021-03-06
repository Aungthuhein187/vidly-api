const { createLogger, format, transports } = require("winston");
const config = require("config");
require("winston-mongodb");
require("express-async-errors");

const logger = createLogger({
  level: "info",
  transports: [
    new transports.File({ filename: "log/combined.log" }),
    new transports.MongoDB({
      db: config.get("db"),
    }),
  ],
  exceptionHandlers: [new transports.File({ filename: "log/exceptions.log" })],
  rejectionHandlers: [new transports.File({ filename: "log/rejections.log" })],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

module.exports = logger;

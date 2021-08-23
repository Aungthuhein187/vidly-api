const { createLogger, transports } = require("winston");
require("winston-mongodb");
require("express-async-errors");

const logger = createLogger({
  level: "info",
  transports: [
    new transports.Console(),
    new transports.File({ filename: "path/to/combined.log" }),
    new transports.MongoDB({
      db: "mongodb://localhost/vidly",
    }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: "path/to/exceptions.log" }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: "path/to/rejections.log" }),
  ],
});

module.exports = logger;

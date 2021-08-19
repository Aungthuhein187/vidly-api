const { createLogger, format, transports } = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.export = function () {
  createLogger({
    transports: [
      new transports.Console({
        level: "info",
        format: format.combine(format.colorize(), format.simple()),
      }),
      new transports.File({ filename: "path/to/combined.log" }),
      new transports.MongoDB({
        db: "mongodb://localhost/vidly",
        level: "info",
      }),
    ],
    exceptionHandlers: [
      new transports.File({ filename: "path/to/exceptions.log" }),
    ],
    rejectionHandlers: [
      new transports.File({ filename: "path/to/rejections.log" }),
    ],
  });
};

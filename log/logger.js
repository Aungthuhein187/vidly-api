const { createLogger, format, transports } = require("winston");
require("winston-mongodb");

const logger = createLogger({
  transports: [
    new transports.File({ filename: "path/to/combined.log" }),
    new transports.MongoDB({ db: "mongodb://localhost/vidly" }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: "path/to/exceptions.log" }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: "path/to/rejections.log" }),
  ],
});

const consoleLogger = () => {
  return logger.add(
    new transports.Console({
      format: format.simple(),
    })
  );
};

exports.logger = logger;
exports.consoleLogger = consoleLogger;

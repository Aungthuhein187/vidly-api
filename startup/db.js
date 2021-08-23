const config = require("config");
const Fawn = require("fawn");
const mongoose = require("mongoose");
const logger = require("./logging");

Fawn.init(mongoose);

module.exports = function () {
  const db = config.get("db");
  mongoose
    .connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    .then(() => logger.info(`Connected to ${db}...`));
};

const express = require("express");
const app = express();
const config = require("config");
const Fawn = require("fawn");
const helmet = require("helmet");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const morgan = require("morgan");

require("./startup/logging");
require("./startup/route")(app);
require("./startup/db");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

Fawn.init(mongoose);
if (app.get("env") === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(helmet());

const port = process.env.NODE_ENV || 3000;
app.listen(port, () => {
  console.log(`Listening at port ${port}.....`);
});

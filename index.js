const express = require("express");
const app = express();
const config = require("config");
const Fawn = require("fawn");
const helmet = require("helmet");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const morgan = require("morgan");

require("./startup/logging");
require("./startup/route")(app);

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/vidly", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) => console.error("Cannot connect to mongodb...", err));

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

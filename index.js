const express = require("express");
const app = express();
const config = require("config");
const error = require("./middlewares/error");
const Fawn = require("fawn");
const helmet = require("helmet");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const morgan = require("morgan");
require("express-async-errors");

const auth = require("./routes/auth");
const customers = require("./routes/customers");
const genres = require("./routes/genres");
const home = require("./routes/home");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const consoleLogger = require("./log/logger");

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
  consoleLogger;
}

app.use(express.json());
app.use(helmet());

app.use("/", home);
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use(error);

const port = process.env.NODE_ENV || 3000;
app.listen(port, () => {
  console.log(`Listening at port ${port}.....`);
});

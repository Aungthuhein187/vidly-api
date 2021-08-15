const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const morgan = require("morgan");
const app = express();

const genres = require("./routes/genres");
const home = require("./routes/home");

app.use(express.json());
app.use(helmet());
if (app.get("env") === "development") app.use(morgan("dev"));

app.use("/", home);
app.use("/api/genres", genres);

mongoose.connect("mongodb://localhost/vidly", {useUnifiedTopology: true, useNewUrlParser: true})
    .then(() => console.log("Connected to mongodb..."))
    .catch(err => console.error("Cannot connect to mongodb...", err));

const port = process.env.NODE_ENV || 3000;
app.listen(port, () => {
    console.log(`Listening at port ${port}.....`);
});
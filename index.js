const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();

const genres = require("./routes/genres");
const home = require("./routes/home");

app.use(express.json());
app.use(helmet());
if (app.get("env") === "development") app.use(morgan("dev"));

app.use("/", home);
app.use("/api/genres", genres);

const port = process.env.NODE_ENV || 3000;
app.listen(port, () => {
    console.log(`Listening at port ${port}.....`);
});
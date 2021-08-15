const express = require("express");
const home = require("./routes/home");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(helmet());
if (app.get("env") === "development") app.use(morgan("dev"));

app.use("/", home);

const port = process.env.NODE_ENV || 3000;
app.listen(port, () => {
    console.log(`Listening at port ${port}.....`);
});
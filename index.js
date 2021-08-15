const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!!!");
});

const port = process.env.NODE_ENV || 3000;
app.listen(port, () => {
    console.log(`Listening at port ${port}.....`);
});
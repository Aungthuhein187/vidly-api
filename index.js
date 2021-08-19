const express = require("express");
const app = express();

require("./startup/logging");
require("./startup/db")();
require("./startup/route")(app);
require("./startup/config")(app);
require("./startup/validation")();

const port = process.env.NODE_ENV || 3000;
app.listen(port, () => {
  console.log(`Listening at port ${port}.....`);
});

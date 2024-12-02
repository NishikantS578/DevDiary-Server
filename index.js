const express = require("express");
const cors = require("cors");

require("dotenv").config();
require("./config/db");

const indexRouter = require("./routes/indexRoute");

const app = express();

const port = 8080;

app.use(cors());
app.use(express.json());

app.use("/api", indexRouter)

app.listen(port, () => {
    console.log("Server is listening at port "+port);
});
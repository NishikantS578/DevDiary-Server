const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();
require("./config/db");

const indexRouter = require("./routes/indexRoute");

const app = express();

const port = process.env.PORT || 8080;

app.use(cookieParser())
app.use(express.json());
app.use(cors({ origin: [process.env.FRONTEND_URL], credentials: true }));

app.use("/api", indexRouter)

app.listen(port, () => {
    console.log("Server is listening at port " + port);
});
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();
const admin = require("./routes/admin");
const reader = require("./routes/reader");
const { logger } = require("./config");
const { PORT } = require("./constants");

// Creating Express Application
const app = express();
app.use(cors());
app.use(express.json());

// Adding routes
app.use("/reader", reader.router);
app.use("/admin", admin.router);

// Catch and report 404 page requests
app.use(function (req, res) {
    logger.warn(`404 Error Request - ${req}`);
    return res.status(404).json({ error: "URL does not exists" });
});

// Listening for requests
app.listen(PORT);

const mysql = require("mysql");
const winston = require("winston");
const { DB_DETAILS } = require("./constants");

// Initialising Logger
const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
});

// Connecting MYSQL DB
const db = mysql.createConnection(DB_DETAILS);
db.connect((err) => {
    if (err) {
        logger.error(`MYSQL Connection failed ${err}`);
    } else {
        logger.info(`DB connection success`);
    }
});

module.exports = {
    logger,
    db,
};

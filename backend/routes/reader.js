const { query, Router } = require("express");
const express = require("express");
const { Console } = require("winston/lib/winston/transports");
const { logger, db } = require("../config");
const { DBQ, BOOK_LIMIT, RESERVE_LIMIT, ERROR } = require("../constants");

const router = express.Router();

router.post("/login", (req, res) => {
    db.query(
        `SELECT ${DBQ.READER_PASSWD} from ${DBQ.READER} where ${DBQ.READER_ID}=${req.body.uid}`,
        (error, result) => {
            if (error) {
                logger.error(`Error in DB Query ${error.message}`);
                res.status(500).json({ error: ERROR[500] });
            } else if (result.length == 1 && result[0][DBQ.READER_PASSWD] == req.body.password) {
                logger.info(`Log in success for ${req.body.uid}`);
                res.status(200).json({ result: "success" });

                // Send AUTH Token
            } else {
                logger.info(`Wrong username/password - '${JSON.stringify(req.body)}'`);
                res.status(404).json({ error: "Invalid id/password. Please re-login" });
            }
        }
    );
});

router.post("/search", (req, res) => {
    let query = "";
    if (req.body.searchBy == DBQ.PUBLISHER) {
        query = `SELECT * FROM ${DBQ.DOCUMENT} NATURAL JOIN ${DBQ.PUBLISHER} WHERE ${DBQ.PUBLISHER_NAME} LIKE "%${req.body.search}%"`;
    } else if (req.body.searchBy == DBQ.DOCUMENT_ID) {
        query = `SELECT * FROM ${DBQ.DOCUMENT} WHERE ${DBQ.DOCUMENT_ID}=${req.body.search}`;
    } else {
        query = `SELECT * FROM ${DBQ.DOCUMENT} WHERE ${DBQ.DOCUMENT_TITLE} LIKE "%${req.body.search}%"`;
    }
    db.query(query, (error, result) => {
        if (error) {
            logger.error(`Error in DB Querry ${error.message}`);
            res.status(500).json({ error: ERROR[500] });
        } else {
            logger.info(`Executing query ${query}`);
            res.status(200).json({ result: result });
        }
    });
});

router.post("/document/check", (req, res) => {
    // Checking if document is available
    db.query(
        `SELECT * from ${DBQ.DOCUMENT_COPY} NATURAL JOIN ${DBQ.BRANCH} where ${DBQ.DOCUMENT_ID}=${req.body.doc_id} AND ${DBQ.DOCUMENT_COPY_AVAILABLE} IS TRUE`,
        (error, result) => {
            if (error) {
                logger.error(`Error in DB Query - ${error.message}`);
                res.status(500).json({ error: ERROR[500] });
            } else {
                logger.info(`Finding Available Documents with ID - ${req.body.doc_id}`);
                res.status(200).json({ result: result });
            }
        }
    );
});

router.post("/document/checkout", (req, res) => {
    // Checking if user is authorised to reserve more books
    db.query(
        `SELECT * from ${DBQ.BORROWS} where ${DBQ.READER_ID}=${req.body.uid} AND ${DBQ.BORROW_RTIME} IS NULL LIMIT ${BOOK_LIMIT}`,
        (error, result) => {
            if (error) {
                logger.error(`Error count User's Borrows - ${error.message}`);
                res.status(500).json({ error: ERROR[500] });
            } else if (result.length == BOOK_LIMIT) {
                console.log("checl");
                logger.info(`User has capped his booking limit. Cannot reserve more books`);
                res.status(403).json({ error: `User has reached borrow limit of ${BOOK_LIMIT}` });
            } else {
                // Checking if document is available
                db.query(
                    `SELECT * from ${DBQ.DOCUMENT_COPY} where ${DBQ.DOCUMENT_COPY_ID}=${req.body.doc_uuid} AND ${DBQ.DOCUMENT_COPY_AVAILABLE} IS TRUE`,
                    (error, result) => {
                        if (error) {
                            logger.error(`Error in DB Query - ${error.message}`);
                            res.status(500).json({ error: ERROR[500] });
                        } else if (result.length == 0) {
                            logger.info(`Document copy no longer available for checkout - ${req.body.doc_uuid}`);
                            res.status(200).json({ error: `The document is no longer available` });
                        } else {
                            // Reserving Document
                            db.query(
                                `INSERT INTO ${DBQ.BORROWS} (${DBQ.BORROWED_DOCUMENT_ID}, ${DBQ.READER_ID}) VALUES (${req.body.doc_uuid}, ${req.body.uid})`,
                                (error) => {
                                    if (error) {
                                        logger.error(`Error in DB Query - ${error.message}`);
                                        res.status(500).json({ error: ERROR[500] });
                                    } else {
                                        logger.info(`Booking confirmed for document - ${req.body.doc_uuid}`);
                                        res.status(200).json({ result: `Booking confirmed` });
                                    }
                                }
                            );
                        }
                    }
                );
            }
        }
    );
});

router.post("/document/return", (req, res) => {
    // Returning Document
    db.query(
        `UPDATE ${DBQ.BORROWS} SET ${DBQ.BORROW_RTIME}=(CURRENT_DATE) WHERE ${DBQ.BORROW_ID}=${req.body.borrowID} AND ${DBQ.READER_ID}=${req.body.uid}`,
        (error) => {
            if (error) {
                logger.error(`Error returning Docment - ${error.message}`);
                res.status(500).json({ error: ERROR[500] });
            } else {
                logger.info(`Document returned if exists ${req.body}`);
                res.status(200).json({ result: `Document Successfully returned` });
            }
        }
    );
});

router.post("/document/reserve", (req, res) => {
    // Checking if user is authorised to reserve more books
    db.query(
        `SELECT * from ${DBQ.RESERVES} where ${DBQ.READER_ID}=${req.body.uid} AND ${DBQ.RESERVES_STATUS} IS NULL LIMIT ${RESERVE_LIMIT}`,
        (error, result) => {
            if (error) {
                logger.error(`Error count User's Reserves - ${error.message}`);
                res.status(500).json({ error: ERROR[500] });
            } else if (result.length == RESERVE_LIMIT) {
                logger.info(`User has capped his reserve limit. Cannot reserve more books`);
                res.status(403).json({ error: `User has reached reserve limit of ${RESERVE_LIMIT}` });
            } else {
                // Checking if document is available
                db.query(
                    `SELECT * from ${DBQ.DOCUMENT_COPY} where ${DBQ.DOCUMENT_COPY_ID}=${req.body.doc_uuid} AND ${DBQ.DOCUMENT_COPY_AVAILABLE} IS TRUE`,
                    (error, result) => {
                        if (error) {
                            logger.error(`Error in DB Query - ${error.message}`);
                            res.status(500).json({ error: ERROR[500] });
                        } else if (result.length == 0) {
                            logger.info(`Document copy no longer available for Reservation - ${req.body.doc_uuid}`);
                            res.status(200).json({ error: `The document is no longer available` });
                        } else {
                            // Reserving Document
                            db.query(
                                `INSERT INTO ${DBQ.RESERVES} (${DBQ.RESERVES_DOCUMENT_ID}, ${DBQ.READER_ID}) VALUES (${req.body.doc_uuid}, ${req.body.uid})`,
                                (error) => {
                                    if (error) {
                                        logger.error(`Error in DB Query - ${error.message}`);
                                        res.status(500).json({ error: ERROR[500] });
                                    } else {
                                        logger.info(`Reservation confirmed for document - ${req.body.doc_uuid}`);
                                        res.status(200).json({ result: `Reservation confirmed` });
                                    }
                                }
                            );
                        }
                    }
                );
            }
        }
    );
});

router.post("/document/reserve/checkout", (req, res) => {
    // Checking out document already reserved by user
    db.query(
        `SELECT ${DBQ.RESERVES_DOCUMENT_ID} FROM ${DBQ.RESERVES} WHERE ${DBQ.RESERVE_ID}=${req.body.reserveID} AND ${DBQ.READER_ID}=${req.body.uid} AND ${DBQ.RESERVES_STATUS} IS NULL`,
        (error, result) => {
            if (error) {
                logger.error(`Error while checking out reserve Document - ${error.message}`);
                res.status(500).json({ error: ERROR[500] });
            } else if (result.length == 0) {
                logger.info(`Reservation no longer available ${req.body}`);
                res.status(204).json({ result: "Reservation no longer available" });
            } else {
                // Updating reserve status
                db.query(
                    `UPDATE ${DBQ.RESERVES} SET ${DBQ.RESERVES_STATUS}=TRUE WHERE ${DBQ.RESERVE_ID}=${req.body.reserveID} AND ${DBQ.READER_ID}=${req.body.uid}`,
                    (error) => {
                        if (error) {
                            logger.error(`Error updating reserve document status ${req.body} - ${error.message}`);
                            res.status(500).json({ error: ERROR[500] });
                        } else {
                            // Adding to Borrows table
                            db.query(
                                `INSERT INTO ${DBQ.BORROWS} (${DBQ.BORROWED_DOCUMENT_ID}, ${DBQ.READER_ID}) VALUES (${
                                    result[0][DBQ.RESERVES_DOCUMENT_ID]
                                }, ${req.body.uid})`,
                                (error) => {
                                    if (error) {
                                        logger.error(
                                            `Error adding reserved document to borrow ${req.body} - ${error.message}`
                                        );
                                        res.status(500).json({ error: ERROR[500] });
                                    } else {
                                        logger.info(
                                            `Document borrowed - ${result[0][DBQ.RESERVES_DOCUMENT_ID]} by ${
                                                req.body.uid
                                            }`
                                        );
                                        res.status(200).json({ result: "Document borrow successfully" });
                                    }
                                }
                            );
                        }
                    }
                );
            }
        }
    );
});

router.post("/status/bookings/reserves", (req, res) => {
    db.query(
        `SELECT * FROM ${DBQ.RESERVES} WHERE ${DBQ.READER_ID}=${req.body.uid} ORDER BY ${DBQ.RESERVES_STATUS}`,
        (error, result) => {
            if (error) {
                logger.error(`Error count User's Reserves - ${error.message}`);
                res.status(500).json({ error: ERROR[500] });
            } else {
                logger.info(`Evaluated user's reserves. UID - ${req.body.uid}`);
                res.status(200).json({ result });
            }
        }
    );
});

router.post("/status/bookings/borrows", (req, res) => {
    db.query(
        `SELECT * FROM ${DBQ.BORROWS} WHERE ${DBQ.READER_ID}=${req.body.uid} ORDER BY ${DBQ.BORROW_RTIME}`,
        (error, result) => {
            if (error) {
                logger.error(`Error count User's Borrows - ${error.message}`);
                res.status(500).json({ error: ERROR[500] });
            } else {
                logger.info(`Evaluated user's reserves UID - ${req.body.uid}`);
                res.status(200).json({ result });
            }
        }
    );
});

router.post("/status/fines", (req, res) => {
    db.query(
        `SELECT SUM(${DBQ.BORROW_FINES}) FROM ${DBQ.BORROWS} WHERE ${DBQ.READER_ID}=${req.body.uid}`,
        (error, result) => {
            if (error) {
                logger.error(`Error evaluating user's fine - ${error.message}`);
                res.status(500).json({ error: ERROR[500] });
            } else if (result.length == 1) {
                logger.info(`Evaluated user's fine - ${req.body.uid}`);
                res.status(200).json({ result: result.Fine });
            } else {
                logger.info(`User Dosen't Exists - ${req.body.uid}`);
                res.status(200).json({ result });
            }
        }
    );
});

module.exports = {
    router,
};

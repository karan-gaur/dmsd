const { Router } = require("express");
const express = require("express");
const router = express.Router();

const { db, logger } = require("../config");
const { DBQ, ERROR } = require("../constants");
const { validateNewPublisher, validateNewDocument, validateNewCopy, validateNewReader } = require("../utility");

// Listing all Library Branches
router.get("/branches", (req, res) => {
    db.query(`SELECT * FROM ${DBQ.BRANCH}`, (error, result) => {
        if (error) {
            logger.error(`Error Fetching all branch information - ${error.message}`);
            return res.status(500).json({ error: ERROR[500] });
        }
        logger.info(`Listing all branches`);
        return res.status(200).json({ result });
    });
});

router.get("/publishers", (req, res) => {
    db.query(`SELECT * FROM ${DBQ.PUBLISHER}`, (error, result) => {
        if (error) {
            logger.error(`Error Fetching all publisher information - ${error.message}`);
            return res.status(500).json({ error: ERROR[500] });
        }
        logger.info(`Listing all publishers`);
        return res.status(200).json({ result });
    });
});

// Adding Publisher
router.post("/add/publisher", validateNewPublisher, (req, res) => {
    db.query(
        `INSERT INTO ${DBQ.PUBLISHER} (${DBQ.PUBLISHER_NAME}, ${DBQ.PUBLISHER_ADDRESS}) VALUES ("${req.body.name}", "${req.body.address}")`,
        (error) => {
            if (error) {
                logger.error(`Error Adding Publisher - ${error.message}`);
                return res.status(500).json({ error: ERROR[500] });
            }
            logger.info(`Publisher added - ${req.body}`);
            return res.status(200).json({ result: `Publisher added` });
        }
    );
});

// Adding Document
router.post("/add/document", validateNewDocument, (req, res) => {
    db.query(
        `INSERT INTO ${DBQ.DOCUMENT} (${DBQ.DOCUMENT_TITLE}, ${DBQ.DOCUMENT_PDATE}, ${DBQ.PUBLSIHER_ID}) VALUES ("${req.body.title}", "${req.body.pdate}", ${req.body.publisherID})`,
        (error) => {
            if (error) {
                logger.error(`Error Adding Document - ${error.message}`);
                return res.status(500).json({ error: ERROR[500] });
            }
            logger.info(`Document added - ${req.body}`);
            return res.status(200).json({ result: `Document added` });
        }
    );
});

// Adding Document Copy
router.post("/add/copy", validateNewCopy, (req, res) => {
    db.query(
        `INSERT INTO ${DBQ.DOCUMENT_COPY} (${DBQ.DOCUMENT_ID}, ${DBQ.DOCUMENT_COPY_NUM}, ${DBQ.BRANCH_ID}) VALUES (${req.body.doc_id}, ${req.body.copy_no}, ${req.body.bid})`,
        (error) => {
            if (error) {
                logger.error(`Error Adding Document Copy - ${error.message}`);
                return res.status(500).json({ error: ERROR[500] });
            }
            logger.info(`Document Copy added - ${req.body}`);
            return res.status(200).json({ result: `Document Copy added` });
        }
    );
});

// Adding Reader
router.post("/add/reader", validateNewReader, (req, res) => {
    db.query(
        `INSERT INTO ${DBQ.READER} (${DBQ.READER_NAME}, ${DBQ.READER_PASSWD}, ${DBQ.READER_TYPE}, ${DBQ.READER_ADDRESS}, ${DBQ.READER_PHONE_NUM}) VALUES ("${req.body.name}", "${req.body.password}", "${req.body.type}", "${req.body.address}", "${req.body.phone}")`,
        (error) => {
            if (error) {
                logger.error(`Error Adding Reader - ${error.message}`);
                return res.status(500).json({ error: ERROR[500] });
            }
            logger.info(`Reader added - ${req.body}`);
            return res.status(200).json({ result: `Reader added` });
        }
    );
});

// Search Document

module.exports = {
    router,
};

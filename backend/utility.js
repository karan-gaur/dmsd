const jwt = require("jsonwebtoken");

const { TOKEN_EXPIRY, TOKEN_KEY, USER, SEARCH_BY } = require("./constants");
const { logger } = require("./config");
const e = require("express");

// Generate Access Token
const generateAccessToken = (permission, uid) => {
    return jwt.sign(
        {
            uid: uid,
            permission: permission,
        },
        TOKEN_KEY,
        { expiresIn: TOKEN_EXPIRY }
    );
};

// Verify Access Token
const validateUserToken = (req, res, next) => {
    req.body.token = req.headers["authorization"].split(" ")[1];
    if (typeof req.body.token !== "string") {
        logger.error(`Invalid token in body - ${req.body}`);
        return res.status(400).json({ error: "Missing/Ivalid Token. Please login again" });
    } else {
        try {
            req.body.token = jwt.verify(req.body.token, TOKEN_KEY);
        } catch (err) {
            logger.error(`Error validating JWT from request. Err - ${err}`);
            return res.status(401).json({ error: "JWT Token unauthorised - reissue required." });
        }
    }
    next();
};

// Validate Admin's Token
const validateAdminToken = (req, res, next) => {
    if (typeof req.body.token !== "string") {
        logger.error(`Invalid token in body - ${req.body}`);
        return res.status(400).json({ error: "Missing/Ivalid Token. Please login again" });
    } else {
        try {
            req.body.token = jwt.verify(req.body.token);
            if (req.body.token.permission !== USER.STAFF && req.body.token.permission !== USER.ADMIN) {
                logger.warn(`Unauthorised user token access - ${req.body}`);
                return res.status(403).json({ error: `Unauthorised access.` });
            }
        } catch (err) {
            logger.error(`Error validating JWT from request. Err - ${err}`);
            return res.status(401).json({ error: "JWT Token unauthorised - reissue required." });
        }
    }
    next();
};

// Validating user's ID
const validateEmail = (req, res, next) => {
    if ((typeof req.body.uid !== "number" && isNaN(req.body.uid)) || typeof req.body.password !== "string") {
        logger.error(`Invalid value for 'login' in body - ${req.body}`);
        return res.status(400).json({
            error: "Missing/Ivalid values. Expected - { 'uid': 'Must be number', 'password': 'Must be non-empty string'}",
        });
    }
    next();
};

// Validating params for Search in Documents
const validateSearchParams = (req, res, next) => {
    console.log(req.body.searchBy in SEARCH_BY);
    if (typeof req.body.search !== "string" || !(req.body.searchBy in SEARCH_BY)) {
        logger.error(`Invalid value for search params - ${req.body}`);
        return res.status(400).json({
            error: `Missing/Ivalid. { 'search' : 'must be string', 'searchBy': '${SEARCH_BY.doc_id} || ${SEARCH_BY.title} || ${SEARCH_BY.publisher}'`,
        });
    } else {
        next();
    }
};

// Valudating Document ID
const validateDocID = (req, res, next) => {
    if (typeof req.body.doc_id !== "number") {
        logger.error(`Invalid value for 'DOC_ID' in body - ${req.body.doc_id}`);
        return res.status(400).json({ error: "Missing/Ivalid value for 'doc_id'. Must be number" });
    } else {
        next();
    }
};

// Validting Document Copy ID
const validateCopyID = (req, res, next) => {
    if (typeof req.body.doc_uuid !== "number") {
        logger.error(`Invalid value for doc_uuid in body - ${req.body.doc_uuid}`);
        return res.status(400).json({ error: "Missing/Ivalid value for 'doc_uuid'. Must be number" });
    } else {
        next();
    }
};

// Validating BorrowID
const validateBorrowID = (req, res, next) => {
    if (typeof req.body.borrowID !== "number") {
        logger.error(`Invalid value for 'borrowID' in body - ${req.body}`);
        return res.status(400).json({ error: "Missing/Ivalid value for 'borrowID'. Must be a number" });
    } else {
        next();
    }
};

// Validating ReserveID
const validateReserveID = (req, res, next) => {
    if (typeof req.body.reserveID !== "number") {
        logger.error(`Invalid value for 'reserveID' in body - ${req.body}`);
        return res.status(400).json({ error: "Missing/Ivalid value for 'reserveID'. Must be number" });
    } else {
        next();
    }
};

module.exports = {
    validateDocID,
    validateEmail,
    validateCopyID,
    validateBorrowID,
    validateReserveID,
    validateUserToken,
    validateAdminToken,
    generateAccessToken,
    validateSearchParams,
};

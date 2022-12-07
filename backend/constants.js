const HOST = "0.0.0.0";
const PORT = "3000";
const DB_DETAILS = {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

// Constraints
const RESERVE_LIMIT = 10;
const BOOK_LIMIT = 10;

// Errors
const ERROR = {
    500: "Internal server error. Please retry after some time",
};

// DB Query Constants
const DBQ = {
    BRANCH: "BRANCH",
    BORROWS: "BORROWS",
    BORROW_FINES: "Fine",
    BORROW_TIME: "BDTime",
    BORROW_RTIME: "RDTime",
    BORROW_ID: "Borrow_ID",
    BORROWED_DOCUMENT_ID: "Doc_Detail",
    COUNT: "COUNT",
    DOCUMENT: "DOCUMENT",
    DOCUMENT_ID: "Doc_ID",
    DOCUMENT_TITLE: "Title",
    DOCUMENT_COPY: "DOC_COPY",
    DOCUMENT_COPY_ID: "UUID",
    DOCUMENT_COPY_AVAILABLE: "Available",
    PUBLISHER: "PUBLISHER",
    PUBLSIHER_ID: "Publisher_ID",
    PUBLISHER_NAME: "Publisher_Name",
    READER: "READER",
    READER_ID: "Reader_ID",
    READER_PASSWD: "Password",
    RESERVES: "RESERVES",
    RESERVES_STATUS: "RStatus",
    RESERVES_DOCUMENT_ID: "Doc_Detail",
};

module.exports = {
    DBQ,
    HOST,
    PORT,
    ERROR,
    DB_DETAILS,
    RESERVE_LIMIT,
    BOOK_LIMIT,
};

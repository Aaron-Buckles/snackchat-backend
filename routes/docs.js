const path = require("path");
const express = require("express");
const router = express.Router();

function sendDoc(res, doc) {
  res.sendFile(path.join(__dirname, `../docs/${doc}-doc.html`));
}

// Index
router.get("/", (req, res) => sendDoc(res, "index"));

router.get("/reviews", (req, res) => sendDoc(res, "reviews"));
router.get("/users", (req, res) => sendDoc(res, "users"));
router.get("/tags", (req, res) => sendDoc(res, "tags"));

module.exports = router;

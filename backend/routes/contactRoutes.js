// routes/contactRoutes.js
const express = require("express");
const router = express.Router();

const { createContact, getAllContacts } = require("../controllers/contactController");

router.get("/", getAllContacts);

router.post("/", createContact);

module.exports = router;
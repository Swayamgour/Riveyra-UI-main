const express = require("express");
const router = express.Router();

const { getDashboardCounts } = require("../controllers/dashboardController");

router.get("/counts", getDashboardCounts);

module.exports = router;
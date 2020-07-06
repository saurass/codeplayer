const express = require("express");
const router = express.Router();
const workerController = require("../controllers/worker");

router.get("/testdata/:submissionId", workerController.testData);

module.exports = router;
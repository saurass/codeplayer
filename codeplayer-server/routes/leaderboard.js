var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
const leaderboardController = require("../controllers/leaderboard");

router.get("/:contestId", [
		check("contestId").notEmpty().withMessage("Contest ID is Required")
], leaderboardController.getLeaderBoard)

module.exports = router;
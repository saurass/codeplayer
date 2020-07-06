var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");

var donationController = require("../controllers/donation");

router.post("/order", [
		check("amount").notEmpty().isNumeric().withMessage("Valid Amount is Required"),
	], donationController.order)

router.post("/verify", donationController.verify);


module.exports = router;
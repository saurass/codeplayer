const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const authController = require("../controllers/auth");
const userController = require("../controllers/user");
const quesController = require("../controllers/question");
const submissionController = require("../controllers/submission");

router.use(authController.isSignedIn, userController.getUserById);

router.param("questionId", quesController.getQuestionData);

/*
|------------------------------------------------------
|   Create Submission
|------------------------------------------------------
*/
router.post("/create/:questionId", [
    check("code").notEmpty().withMessage("You need to write some code"),
    check("lang").notEmpty().withMessage("You need to select a language")
], submissionController.makesubmission);

module.exports = router;
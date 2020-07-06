var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
var authController = require("../controllers/auth");
var userController = require("../controllers/user");
var quesController = require("../controllers/question")
var testController = require("../controllers/testcase")

router.use(authController.isSignedIn, userController.getUserById, authController.isAdminOrSemiAdmin)

router.param("questionId", quesController.getQuestionData, quesController.isProblemSetter);

// Create test case
router.post("/create/:questionId/", testController.createTestCase)

//Fetch Ques About and testcases
router.get("/:questionId", testController.fetchAllTestCases)

//Fetch Input for testcase
router.get("/input/raw/:questionId/:testcaseId", testController.fetchRawInput)

//Fetch Output for testcase
router.get("/output/raw/:questionId/:testcaseId", testController.fetchRawOutput)

//Delete A testcase
router.get("/delete/:questionId/:testcaseId", testController.deleteOneTestCase)

module.exports = router;
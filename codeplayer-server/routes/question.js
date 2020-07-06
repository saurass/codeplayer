var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
var authController = require("../controllers/auth");
var userController = require("../controllers/user");
var quesController = require("../controllers/question");
var contestController = require("../controllers/contest");

router.use(authController.isSignedIn);

// Get Question statement file only
router.get("/statement/:questionId", [
    check("questionId").notEmpty().withMessage("Question ID is Required")
], quesController.getProblemStatement);


// These are priveledged routes
router.use(userController.getUserById, authController.isAdminOrSemiAdmin);

// Create question -- using FORM DATA
router.post("/create/:contestId",
    contestController.doesContestExist,
    contestController.isUserTheOrganizerOrAdmin,
    quesController.createQuestion);


router.param("questionId", quesController.getQuestionData);

// Update question -- using FORM DATA
router.put("/update/:questionId", [
    check("questionId").notEmpty().withMessage("Question ID is Required")
], quesController.isProblemSetter, quesController.updateQuestion);

// Delete ques
router.delete("/statement/:questionId", [
    check("questionId").notEmpty().withMessage("Question ID is Required")
], quesController.isProblemSetter, quesController.deleteQuestion);

module.exports = router;
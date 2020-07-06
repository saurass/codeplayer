var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
var authController = require("../controllers/auth");
var contestController = require("../controllers/contest");
var userController = require("../controllers/user");
var quesController = require("../controllers/question");

router.use(authController.isSignedIn, userController.getUserById)

// Get Contests
router.get("/", contestController.getContest)

// Get Contest Question List
router.get("/:contestId", [
    check('contestId').notEmpty().withMessage("Contest ID is required")
], contestController.getContestQuestion)

router.use(authController.isAdminOrSemiAdmin);

// Create Contest
router.post("/create", [
    check("name").notEmpty().withMessage("Contest name is required"),
    check("starttime").isNumeric().withMessage("provide valid start time"),
    check("endtime").isNumeric().withMessage("provide valid end time"),
], contestController.isValidContestInterval,
    contestController.isNewContestName,
    contestController.createContest);

// Update Contest
router.put("/update", [
    check("_id").notEmpty().withMessage("Contest ID is required"),
    check("name").notEmpty().withMessage("Contest name is required").optional(),
    check("starttime").isNumeric().withMessage("provide valid start time").optional(),
    check("endtime").isNumeric().withMessage("provide valid end time").optional(),
], contestController.doesContestExist,
    contestController.isUserTheOrganizerOrAdmin,
    contestController.checkStartTime,
    contestController.updateContest);

// Delete Contest
router.delete("/delete", [
    check('_id').notEmpty().withMessage("Contest ID is required")
], contestController.doesContestExist,
    contestController.isUserTheOrganizerOrAdmin,
    contestController.deleteContest);

module.exports = router;
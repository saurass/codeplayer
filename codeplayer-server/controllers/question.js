const fm = require("formidable");
const { ers } = require("./error");
const Question = require("../models/question");
const Contest = require("../models/contest");
const { check, validationResult } = require("express-validator");
const testcaseCtrl = require("./testcase");
const S3 = require("./s3controller");
const contest = require("../models/contest");
const { createResponseObject } = require("../utils/utils");

/*
|------------------------------------------------------
|   Create Question
|------------------------------------------------------
*/
exports.createQuestion = (req, res) => {
    let form = new fm.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return ers(res, 400, "Something wrong with form sir !")
        }

        if (!fields.name) {
            return ers(res, 400, "Question Name is Required");
        }

        if (!fields.memorylimit) {
            return ers(res, 400, "Memory Limit is Required");
        }

        if (!fields.timelimit) {
            return ers(res, 400, "Time Limit is Required");
        }

        let question = new Question(fields);
        question.user = req.profile._id;
        question.contest = req.params.contestId;
        // Save Problem Statement - file
        if (file.statement) {
            question.save((err, question) => {
                // question.contest.questions.push(question._id);
                if (err) {
                    return ers(res, 400, "Failed to save the question make sure that the question name is unique")
                }
                // Push to parent questions array in contest
                Contest.findOneAndUpdate(
                    { _id: req.params.contestId },
                    { $push: { questions: question._id } },
                    { new: true, useFindAndModify: false },
                    (err, success) => {
                    }
                )
                S3.saveFile(file.statement.path, `questions/${question._id}.txt`);
                return res.json(question);
            });

        } else {
            return ers(res, 403, "Problem Statement File is required")
        }

    })
}

/*
|------------------------------------------------------
|   Get Problem Statement File - Only Controller
|------------------------------------------------------
*/
exports.getProblemStatement = (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return ers(res, 422, error.array()[0].msg);
    }

    Question.findById(req.params.questionId, (err, question) => {
        if (err || !question) {
            return ers(res, 404, "Question Statement Not Found");
        }

        S3.readFile(question.statement).then(data => {
            return res.json({ "question": data, name: question.name })
        }).catch(err => {
            return ers(res, 404, "Question Not Found !!!");
        });
    });
}

/*
|------------------------------------------------------
|   Update Question
|------------------------------------------------------
*/
exports.updateQuestion = (req, res) => {
    let form = new fm.IncomingForm();
    form.keepExtensions = true;

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return ers(res, 422, error.array()[0].msg);
    }

    form.parse(req, (err, fields, file) => {
        if (err) {
            return ers(res, 400, "Something wrong with form")
        }

        Question.findById(
            { _id: req.params.questionId },
            (err, ques) => {
                if (err || !ques) {
                    return ers(res, 404, "Question Not Found")
                }
                if (fields.name)
                    ques.name = fields.name;

                ques.save((err, question) => {
                    if (err || !question) {
                        return ers(400, "Fail to update");
                    }
                    if (file.statement) {
                        S3.saveFile(file.statement.path, ques.statement);
                    }
                    return res.json(question);
                });

            }
        );

    });
}

/*
|------------------------------------------------------
|   Delete Question
|------------------------------------------------------
*/
// TODO: Delete operation at S3 bucket
exports.deleteQuestion = (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return ers(res, 422, error.array()[0].msg);
    }

    Question.findOneAndDelete(
        { _id: req.params.questionId },
        (err, deletedQues) => {
            if (err) {
                return ers(400, "Unable to delete question")
            }
            Contest.findOneAndUpdate(
                { _id: deletedQues.contest },
                { $pull: { questions: deletedQues._id } },
                { new: true, useFindAndModify: false },
                (err, success) => {
                }
            );
            S3.deleteFile(deletedQues.statement);
            testcaseCtrl.deleteTestCase(req.params.questionId)
            res.json({ "success": "Question & testcases Deleted" })
        }
    )
}


/*
|------------------------------------------------------
|   MiddleWares
|------------------------------------------------------
*/

// If user is problem setter or admin
exports.isProblemSetter = (req, res, next) => {
    if (req.profile.role == 0) {
        return next();
    }
    if (req.question.user != req.profile._id) {
        return ers(res, 401, "Not Authorized !!!")
    }
    next();
}

exports.getQuestionData = (req, res, next) => {
    Question.findById(
        { _id: req.params.questionId },
        (err, question) => {
            if (err || !question) {
                return ers(res, 404, "Invalid Question ID")
            }
            req.question = question;
            next();
        }
    )
}



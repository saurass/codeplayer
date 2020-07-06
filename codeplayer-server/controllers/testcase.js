const fm = require("formidable");
const fs = require("fs");
const { ers } = require("./error");
const Question = require("../models/question");
const TestCase = require("../models/testcase");
const { check, validationResult } = require("express-validator");
const S3 = require("./s3controller");
const { createResponseObject } = require("../utils/utils");

/*
|------------------------------------------------------
|   Create TestCase
|------------------------------------------------------
*/
exports.createTestCase = (req, res) => {
    let form = new fm.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return ers(res, 400, "Something Wrong with form");
        }

        if (!file.input || !file.output) {
            return ers(res, 400, "Both I/P and O/P files are required !")
        }

        let testcase = new TestCase(fields);
        testcase.question = req.question._id;
        testcase.input = `testcases/${testcase.question}/${testcase._id}/input.txt`;
        testcase.output = `testcases/${testcase.question}/${testcase._id}/output.txt`

        if (file.input && file.output) {
            testcase.save((err, testcase) => {
                if (err || !testcase) {
                    console.log(err)
                    return ers(res, 400, "Failed to save testcase");
                }
                S3.saveFile(file.input.path, testcase.input);
                S3.saveFile(file.output.path, testcase.output);
                res.json(testcase);
            });

        } else {
            return ers(res, 400, "Both I/P and O/P files are required !")
        }

    });
}

exports.deleteTestCase = (questionId) => {
    TestCase.remove(
        { question: questionId },
        (err, deletedTestCase) => {
            S3.deleteFolder(`testcases/${questionId}/`);
        }
    );
}

exports.deleteOneTestCase = (req, res) => {
    TestCase.deleteOne(
        { _id: req.params.testcaseId },
        (err, deletedTestCase) => {
            S3.deleteFolder(`testcases/${req.params.questionId}/${req.params.testcaseId}`);
            res.json({ message: "Delted" })
        }
    );
}

/*
|------------------------------------------------------
|   Fetch All TestCases And Question about
|------------------------------------------------------
*/
exports.fetchAllTestCases = (req, res) => {
    TestCase.find(
        { question: req.params.questionId },
        (err, testcases) => {
            if (err) {
                console.log(err);
                return ers(res, 400, "Unable to fetch TestCases");
            }
            let retTestCases = [];
            testcases.forEach(testcase => {
                let rettestcase = createResponseObject(testcase, [
                    'input',
                    'output',
                    'id'
                ])

                retTestCases.push(rettestcase);
            })
            let quesData = createResponseObject(req.question, [
                'id',
                'name'
            ])
            return res.json({ testcases: retTestCases, question: quesData });
        }
    )
}

exports.fetchRawInput = (req, res) => {
    TestCase.findOne(
        { _id: req.params.testcaseId },
        (err, testcase) => {
            if (err) {
                return ers(res, 400, "Unable to fetch testcase")
            }
            S3.readFile(testcase.input)
                .then(
                    data => { res.json({ input: data }); }
                )
                .catch(
                    err => { res.json({ error: "Unable to read file" }) }
                )
        }
    )
}

exports.fetchRawOutput = (req, res) => {
    TestCase.findOne(
        { _id: req.params.testcaseId },
        (err, testcase) => {
            if (err) {
                return ers(res, 400, "Unable to fetch testcase")
            }
            S3.readFile(testcase.output)
                .then(
                    data => { res.json({ output: data }); }
                )
                .catch(
                    err => { res.json({ error: "Unable to read file" }) }
                )
        }
    )
}
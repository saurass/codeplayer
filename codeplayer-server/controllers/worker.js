const TestCase = require("../models/testcase");
const Question = require("../models/question");
const Submission = require("../models/submission");

exports.testData = (req, res) => {
    var lang, code;
    Submission.findOne({ _id: req.params.submissionId },
        (err, submit) => {
            lang = submit.language;
            code = submit.submission;
            TestCase.find({ question: submit.question },
                (err, testcases) => {
                    this.testDataGen(lang, testcases, code, submit.question, (response) => {
                        return res.json(response);    
                    });
                }
            )
        }
    )
}

exports.testDataGen = (lang, testcases, code, quesId, cb) => {
    var response = {};
    response.lang = lang;
    response.code = code;
    response.inputs = [];
    response.outputs = [];

    testcases.forEach(testcase => {
        response.inputs.push(testcase.input)
        response.outputs.push(testcase.output)
    });

    Question.findOne({_id: quesId},
        (err, question) => {
            let timelimit = question.timelimit;
            let memorylimit = question.memorylimit;
            response.memorylimit = memorylimit;
            response.timelimit = timelimit;

            cb(response);
        }
    )
}
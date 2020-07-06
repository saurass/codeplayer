const { check, validationResult } = require("express-validator");
const { ers } = require("./error");
const Redis = require("./redis");
const Submission = require("../models/submission")
const S3 = require("./s3controller");

exports.makesubmission = (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return ers(res, 422, error.array()[0].msg);
    }
    var userId = req.auth._id;
    let ctime = new Date();
    ctime = ctime.getTime();
    
    var submission = new Submission();
    submission.question = req.question._id;
    submission.user = userId;
    submission.language = req.body.lang;
    submission.submittime = ctime;
    submission.username = req.profile.username;

    // Save to DB
    submission.save((err, submit) => {
        // Save Code
        S3.saveText(req.body.code, `${submit.submission}`)
            .then((data) => {
                // Add TO Queue
                let dataToQueue = req.profile._id.toString() + "::" + submit._id.toString()
                Redis.push("submissions", dataToQueue);

                res.json({success: "Evaluating your submission Please Hold tight"});
            })
            .catch((err) => {
                ers(res, 422, "Something Went Wrong")
            })
    });

}

exports.updateSubmissionStatus = (msg) => {
    let verdict = "WJ";
    
    if(msg.error) {
        verdict = msg.error;
    } else {
        if(msg.success == 'AC')
            verdict = msg.success;
        else
            return;
    }

    console.log("verdict update", verdict, msg)

    Submission.findOneAndUpdate(
        {_id: msg.submissionId},
        {verdict: verdict},
        { new: true, useFindAndModify: false },
        (err, submission) => {}
    );


}
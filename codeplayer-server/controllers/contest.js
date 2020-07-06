const Contest = require("../models/contest");
const Question = require("../models/question");
const { check, validationResult } = require("express-validator");
const { ers } = require("./error");
const Utils = require("../utils/utils");

/*
|------------------------------------------------------
|   Create Contest Controller
|------------------------------------------------------
*/
exports.createContest = (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return ers(res, 422, error.array()[0].msg);
    }

    var contest = new Contest(req.body);
    contest.organiser.push(req.profile._id);
    contest.save((err, contest) => {
        if (err)
            return ers(res, 400, "Something went Wrong !!!");
        return res.status(200).json(contest);
    })
}

/*
|------------------------------------------------------
|   Update Contest Controller
|------------------------------------------------------
*/
exports.updateContest = (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return ers(res, 422, error.array()[0].msg);
    }

    Contest.findByIdAndUpdate(
        { _id: req.body._id },
        { $set: req.body },
        { new: true, useFindAndModify: false },
        (err, contest) => {
            if (err) {
                return ers(400, "Update Failed");
            }
            return res.json(contest);
        }
    )
}


/*
|------------------------------------------------------
|   Delete Contest Controller
|------------------------------------------------------
*/
exports.deleteContest = (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return ers(res, 422, error.array()[0].msg);
    }

    Contest.findOneAndDelete(
        { _id: req.contestToUpdate._id },
        (err, contest) => {
            if (err) {
                return ers(400, "Unable to delete contest")
            }
            Question.deleteMany(
                { contest: req.contestToUpdate._id },
                (err, result) => {
                }
            )
            return res.json({ "success": "Contest Deleted" })
        }
    )
}

/*
|------------------------------------------------------
|   Get All Contest Controller
|------------------------------------------------------
*/
exports.getContest = (req, res) => {

    Contest.find({}, (err, contests) => {
        if (err) {
            return ers(400, "Unable to reach Database");
        }
        var retcontest = []
        contests.forEach(contest => {

            let tempcontest = Utils.createResponseObject(contest, [
                'numberOfTasks',
                'name',
                'starttime',
                'endtime',
                'id'
            ]);
            tempcontest.organiser = false;
            let found_user = contest.organiser.indexOf(req.profile._id);
            if (found_user >= 0)
                tempcontest.organiser = true;
            retcontest.push(tempcontest);
        })
        return res.json({ "contests": retcontest })
    })
}

/*
|------------------------------------------------------
|   Get Contest Questions
|------------------------------------------------------
*/
exports.getContestQuestion = (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return ers(res, 422, error.array()[0].msg);
    }

    let contestId = req.params.contestId;
    
    let isOrganizer = false;
    Contest.findOne(
        {_id: contestId},
        (err, contest) => {
            if (err || !contest) {
                return ers(res, 404, "Contest Not Found");
            }
            if(contest.organiser.indexOf(req.profile._id) >= 0) {
                isOrganizer = true;
            }
            if(req.profile.role == 0)
                isOrganizer = true;
            if(!contest.isContestStarted()) {
                let ques = [];
                if(isOrganizer) {

                    Question.find(
                    { contest: contestId },
                    (err, questions) => {
                        if (err || !questions) {
                            return ers(400, "Unable to fetch Questions");
                        }
                        
                        questions.forEach((question) => {
                            let retval = Utils.createResponseObject(question, [
                                'id',
                                'name',
                                'points'
                            ])
                            ques.push(retval);
                        })

                        return res.status(400).json({
                            error: "Contest Has Not Yet Started",
                            isOrganiser: isOrganizer,
                            starttime: contest.starttime,
                            endtime: contest.endtime,
                            questions: ques
                        })
                    })
                
                } else {
                    return res.status(400).json({
                        error: "Contest Has Not Yet Started",
                        isOrganiser: isOrganizer,
                        starttime: contest.starttime,
                        endtime: contest.endtime,
                        // questions: ques
                    })
                }
            } else {
                
                Question.find(
                { contest: contestId },
                (err, questions) => {
                    if (err || !questions) {
                        return ers(res, 400, "Unable to fetch Questions");
                    }
            
                    let quesArray = [];
                    questions.forEach((question) => {
                        let retval = Utils.createResponseObject(question, [
                            'id',
                            'name',
                            'points'
                        ])
                        quesArray.push(retval);
                    })

                    return res.json({ "questions": quesArray, "isOrganiser": isOrganizer, "starttime": contest.starttime, "endtime": contest.endtime });
                })
            }
        }
    )

    
}



/*
|------------------------------------------------------
|   MiddleWares
|------------------------------------------------------
*/
exports.isValidContestInterval = (req, res, next) => {
    let startTime = req.body.starttime;
    let endTime = req.body.endtime;
    let current_time = new Date();
    let current_time_in_ms = current_time.getTime();

    if (startTime > current_time_in_ms && startTime < endTime && endTime > current_time_in_ms) {
        next();
    } else {
        return ers(res, 406, "We should not tamper with time, please set a valid interval" + current_time_in_ms )
    }
}

exports.isNewContestName = (req, res, next) => {
    let contest_name = req.body.name;
    Contest.findOne({ name: contest_name }).exec((err, contest) => {
        if (contest) {
            return ers(res, 403, "Please select another contest name")
        }
        next();
    });
}

exports.doesContestExist = (req, res, next) => {

    let reqContestId;
    if (req.params.contestId != undefined) {
        reqContestId = req.params.contestId;
    } else {
        reqContestId = req.body._id;
    }

    Contest.findOne({ _id: reqContestId }).exec((err, contest) => {
        if (!contest || err) {
            return ers(res, 404, "No such Contest Exist")
        }
        req.contestToUpdate = contest;
        next();
    })
}

exports.isUserTheOrganizerOrAdmin = (req, res, next) => {
    // search as organizer
    var found_user = req.contestToUpdate.organiser.indexOf(req.profile._id);
    // if admn, allow
    if (req.profile.role == 0) {
        next();
    }
    else if (found_user < 0) {
        return ers(res, 403, "You are not the organiser");
    }
    else
        next();
}

exports.checkStartTime = (req, res, next) => {
    let newStartTime = req.starttime;
    let newEndTime = req.endtime;
    let oldStartTime = req.contestToUpdate.starttime;
    let oldEndTime = req.contestToUpdate.endtime;

    let current_time = new Date();
    let current_time_in_ms = current_time.getTime();

    if (newStartTime > newEndTime) {
        return ers(res, 403, "we are not good with turning back the time")
    }
    if (newStartTime > current_time_in_ms && oldStartTime < current_time_in_ms) {
        return ers(res, 403, "contest is running")
    }

    next();
}
const { check, validationResult } = require("express-validator");
const { ers } = require("./error");

const Contest = require("../models/contest");
const Submission = require("../models/submission");

let processData = (nSubmission, prevdata) => {
	if(prevdata == undefined) {
		let nobj = {};
		nobj.verdict = {};
		nobj.score = 0;
		nobj.maxtime = 0;
		nobj.penalty = 0;

		prevdata = nobj;
	}

	let {user, question, verdict} = nSubmission;

	let prevSubmitData = prevdata.verdict[question];
	if(prevSubmitData == undefined) {
		let nwobj = {};
		nwobj.attempts = 0;
		nwobj.verdict = 'NA';
		nwobj.donetime = 0;

		prevSubmitData = nwobj;
		prevdata.verdict[question] = prevSubmitData;
	}

	if((nSubmission.verdict == 'WA' || nSubmission.verdict == 'RE' || nSubmission.verdict == 'MLE' || nSubmission.verdict == 'TLE') && prevdata.verdict[question].verdict != 'AC')
		prevdata.verdict[question].attempts++;

	if(nSubmission.verdict == 'WA' && prevdata.verdict[question].verdict != 'AC') {
		prevdata.penalty++;
	}

	if(nSubmission.verdict == 'AC' && prevdata.verdict[question].verdict != 'AC') {
		prevdata.verdict[question].donetime = nSubmission.submittime;
		prevdata.score++;
	}

	if(nSubmission.verdict == 'AC' && prevdata.verdict[question].verdict != 'AC')
		prevdata.maxtime = Math.max(prevdata.maxtime, nSubmission.submittime);

	prevdata.verdict[question].verdict = prevdata.verdict[question].verdict == 'AC' ? 'AC' : nSubmission.verdict;

	return prevdata;

}

const makeRanks = (userArr) => {
	let retval = {};
	let allUserKeys = Object.keys(userArr);
	let penalityTime = 5 * 60 * 1000	// 5 minutes in `ms``
	allUserKeys.sort((usr1, usr2) => {
		let obj1 = userArr[usr1], obj2 = userArr[usr2];
		if(obj1.score == obj2.score) {
			let obj1pen = obj1.maxtime + obj1.penalty * penalityTime;
			let obj2pen = obj2.maxtime + obj2.penalty * penalityTime;

			return obj1pen - obj2pen;
		} else {
			return obj2.score - obj1.score;
		}
	})

	allUserKeys.map((user) => {
		retval[user] = userArr[user];
	})

	return retval
}

const sendResponse = (submissions, starttime, endtime, res, req, questionsArr, contest) => {

    let userArr = {}
    submissions.forEach((submission) => {
    	let {user, question, verdict, username} = submission;
    	let userdata = userArr[username];
    	userArr[username] = processData(submission, userdata)
    });

    userArr = makeRanks(userArr);

    res.json({"leaderboard": userArr, "questions": questionsArr, "contest": {"starttime": contest.starttime, "endtime": contest.endtime}})
}

exports.getutcTime = (utc) => {
	let now = new Date(utc);
	return now.getTime()
}

exports.getLeaderBoard = (req, res) => {
	const error = validationResult(req);
    if (!error.isEmpty()) {
        return ers(res, 422, error.array()[0].msg);
    }

    const contestId = req.params.contestId;

    // Fetch all questions in the contest
    let questionsArr;
    let starttime = null;
    let endtime = null;
    Contest.findOne(
    	{_id: contestId},
    	(err, contest) => {
    		if (err || !contest) {
	            return ers(res, 404, "Contest Not Found");
	        }
	        starttime = contest.starttime;
	        endtime = contest.endtime
	        questionsArr = contest.questions;


	        // Fetch all submissions
		    let userArr = [];
		    Submission.find(
		    	{
		    		'question': {$in: questionsArr},
		    		'submittime': {$gt: starttime, $lt: endtime}
		    	},
		    	(err, submissions) => {
					if (err || !submissions) {
			            return ers(res, 404, "Unable to Fetch Submissions");
			        }
			        sendResponse(submissions, starttime, endtime, res, req, questionsArr, contest);
				}

		    )



    	}
    )

    

}

/*
[

	"user1": {
		verdict: {
			"ques1": {
				attempts: 2,
				verdict: "WA"
			}
			"ques2":
			"ques3":
		},
		score: 123,
		penalty: 2
	},

	"user1": {
		verdict: {
			"ques1": {
				attempts: 2,
				verdict: "WA"
			}
			"ques2": {
				attempts: 0,
				verdict: "NA"
			}
			"ques3":
		},
		score: 123,
		penalty: 3
	}

]

*/


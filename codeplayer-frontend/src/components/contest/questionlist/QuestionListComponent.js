import React, { useState, useEffect } from "react";
import { getContestQuestionList } from "../../../services/contest/contest";
import { useParams, withRouter, Link } from "react-router-dom";
import { deleteQuestion } from "../../../services/question/question";
import notify from "../../../services/toast/Toast";
import { humanPreciseDateFormat } from "../../../services/humanDateFormat";

let nowTime = new Date();
nowTime = nowTime.getTime();

const QuestionListComponent = (props) => {
    const [questionList, setQuestionList] = useState({
        questions: [],
        organiser: true,
        
        evaluating: false,
        loading: true,
        success: false,
        error: "",
        leftTime: "NA",
        contestLeftTime: "NA",
        nowTime: nowTime,
        starttime: 0,
        endtime: 0,
        isOrganiser: false
    });

    const { contestId } = useParams();

    useEffect(() => {
        fetchQuestions();

        let intvs = setInterval(() => {
            setQuestionList(questionList => {
                if(questionList.starttime - questionList.nowTime >= 0) {
                    if(questionList.starttime != 0) {
                        let newTime = new Date();
                        newTime = newTime.getTime();
                        let lftm = humanPreciseDateFormat(newTime.toString(), questionList.starttime)
                        return {
                            ...questionList,
                            nowTime: newTime,
                            leftTime: lftm
                        }
                    } else {
                        let newTime = new Date();
                        newTime = newTime.getTime();
                        return {
                            ...questionList,
                            nowTime: newTime
                        }
                    }
                } else if(questionList.starttime - questionList.nowTime < 0) {
                    if(questionList.starttime != 0) {
                        let newTime = new Date();
                        newTime = newTime.getTime();
                        let clftm = humanPreciseDateFormat(newTime.toString(), questionList.endtime)
                        return {
                            ...questionList,
                            nowTime: newTime,
                            contestLeftTime: clftm
                        }
                    } else {
                        let newTime = new Date();
                        newTime = newTime.getTime();
                        return {
                            ...questionList,
                            nowTime: newTime
                        }
                    }
                } else {
                    clearInterval(intvs);
                    return questionList
                }
            });
        }, 1000)

        return () => clearInterval(intvs);

    }, [])

    const getLocalTime = (utcTime) => {
        return utcTime;
    }

    const fetchQuestions = () => {
        getContestQuestionList(contestId)
            .then(data => {

                if (data.error) {
                    setQuestionList({ ...questionList, error: data.error, isOrganiser: data.isOrganiser, starttime: data.starttime, endtime: data.endtime, loading: false, questions: data.questions ? data.questions : [] })
                } else {
                    setQuestionList({ ...questionList, questions: data.questions, isOrganiser: data.isOrganiser, success: true, loading: false, error: "", starttime: data.starttime, endtime: data.endtime, });
                }
            
            })
            .catch(err => {
                setQuestionList({ ...questionList, loading: false, error: "Please Check Your Internet Connection" })
            })
    }

    const onLoading = () => {
        return questionList.loading && <p className="text-center text-warning font-weight-bold">Please Wait...</p>
    }

    const errorMessage = () => {
        return questionList.error && <p className="text-center text-danger font-weight-bold">{questionList.error}</p>
    }

    const deleteThisQues = (question_id) => {
        setQuestionList({ ...questionList, loading: true });
        deleteQuestion(question_id)
            .then(() => { fetchQuestions(); notify("info", "Question Deleted") })
    }


    const organiserQuesOptions = (question_id) => {
        return questionList.isOrganiser == true &&
            <React.Fragment>
                <span className="float-right badge badge-pill badge-danger ml-2 btn" onClick={() => deleteThisQues(question_id)}>
                    delete
                </span>
                <Link to={`/testcase/add/${question_id}`}>
                    <span className="float-right badge badge-pill badge-warning ml-2 btn">
                        testcases
                    </span>
                </Link>
            </React.Fragment>
    }

    const questionListComp = () => {

        if (questionList.questions.length) {
            return questionList.questions.map((question) => {
                let submissionLink = `/question/${question.id}`;
                return <li className="list-group-item" key={question.id}>
                    <Link to={submissionLink}>
                        {question.name}
                    </Link>
                    {organiserQuesOptions(question.id)}
                    {/* <span className="float-right badge badge-pill badge-info">
                        {question.points}
                    </span> */}
                </li>
            })
        } else {
            return <h6 className="text-center">No ques found !!!</h6>
        }
    }

    const isOrganiser = () => {
        return questionList.isOrganiser && <Link className="ml-auto" to={{
            pathname: `/question/add/${contestId}`
        }}>
            <button className="btn btn-success">Add Question</button>
        </Link>
    }

    const organiserQuestionList = () => {
        if(questionList.isOrganiser) {
            return questionListComp()
        }
    }

    const contestTimeLeftHead = () => {
        if(questionList.endtime - questionList.nowTime >= 0)
            return <h4 className="text-center text-muted">contest ends in {questionList.contestLeftTime}</h4>
        else
        return <h4 className="text-center text-muted">Contest Has Ended</h4>
    }

    const cardBodyData = () => {
        if(!questionList.error) {
            return (
                <React.Fragment>
                    <div className="card my-4">

                        <div className="card-body">
                            <ul className="list-group list-group-flush row">
                                {questionListComp()}
                            </ul>

                        </div>
                    </div>
                    {contestTimeLeftHead()}
                </React.Fragment>
            )
        } else {
            if(questionList.starttime && questionList.endtime) {
                if(questionList.starttime - questionList.nowTime <= 0) {
                    fetchQuestions()
                    return (
                        <div className="card my-4">
    
                            <div className="card-body">
                                <ul className="list-group list-group-flush row">
                                    <h6 className="text-center">Loading Questions...</h6>
                                </ul>
    
                            </div>
                        
                        </div>
                    )
                } else {
                    return (
                        <div className="card my-4">
    
                            <div className="card-body">
                                <ul className="list-group list-group-flush row">
                                    <h6 className="text-center">Contest Begins In {questionList.leftTime}</h6>
                                </ul>

                                {organiserQuestionList()}
    
                            </div>
                        
                        </div>
                    )
                }

            }
        }
    }

    const LeaderBoard = () => {
        let leaderBoardLink = `/leaderboard/${contestId}`;
        return questionList.starttime < questionList.nowTime && <Link to={leaderBoardLink} target="_blank">
            <h6 className="text-center">View LeaderBoard</h6>
        </Link>
    }

    return (
        <div className="container min-height-fix-footer">
            <div className="row mx-0 mt-4">
                {isOrganiser()}
            </div>
            {onLoading()}
            {LeaderBoard()}
            {errorMessage()}
            {cardBodyData()}
        </div>
    );
}

export default withRouter(QuestionListComponent);
import React, { useState } from "react";
import { useParams, Redirect } from "react-router-dom";
import { createQuestion } from "../../../services/question/question";

const QuestionAddComponent = () => {

    const [question, setQuestion] = useState({
        loading: false,
        error: "",
        redirect: false,
        success: false,

        name: "",
        memorylimit: "",
        timelimit: "",
        statement: ""
    });

    const handlechange = name => event => {
        setQuestion({ ...question, [name]: event.target.value });
    }

    const handlechangeFile = name => event => {
        setQuestion({ ...question, [name]: event.target.files[0] });
    }

    const { contestId } = useParams();

    const onLoading = () => {
        return question.loading && <p className="text-center text-warning font-weight-bold">Please Wait...</p>
    }

    const errorMessage = () => {
        return question.error && <p className="text-center text-danger font-weight-bold">{question.error}</p>
    }

    const redirectIfAdded = () => {
        if (question.redirect) {
            return <Redirect to={{
                pathname: `/contest/${contestId}`,
                state: {
                    redirectMsg: {
                        type: "success",
                        message: "Question Added"
                    },
                    organiser: true
                }
            }} />
        }
    }

    const onSubmit = (event) => {
        event.preventDefault();
        question.loading = true;
        setQuestion({ ...question, error: "" })
        createQuestion(question, contestId)
            .then(data => {
                if (data.error) {
                    setQuestion({ ...question, loading: false, error: data.error })
                } else {
                    setQuestion({ ...question, loading: false, error: "", success: true, redirect: true })
                }
            })
            .catch(err => {
                setQuestion({ ...question, loading: false, error: "Please Check Your Internet Connection" })
            })
    }

    return (
        < div className="row min-height-fix-footer mx-0" >
            {redirectIfAdded()}
            <div className="col-md-4 offset-md-4 align-self-center">

                <div className="card">

                    <div className="card-body">
                        <h5 className="text-center pb-3">Add Question</h5>
                        {onLoading()}
                        {errorMessage()}
                        <div className="form-group">
                            <span class="input-label">Name</span>
                            <div className="input-group">
                                <input type="text" className="form-text form-control" onChange={handlechange("name")} placeholder="Question Name" />
                            </div>
                        </div>
                        <div className="form-group">
                            <span class="input-label">Memory Limit</span>
                            <div className="input-group">
                                <input type="text" className="form-text form-control" onChange={handlechange("memorylimit")} placeholder="Memory Limit" />
                            </div>
                        </div>
                        <div className="form-group">
                            <span class="input-label">Time Limit</span>
                            <div className="input-group">
                                <input type="text" className="form-text form-control" onChange={handlechange("timelimit")} placeholder="Time Limit" />
                            </div>
                        </div>
                        <div className="form-group">
                            <span class="input-label">Statement</span>
                            <div className="input-group">
                                <input type="file" placeholder="Password" onChange={handlechangeFile("statement")} className="form-text form-control-file" />
                            </div>
                        </div>
                        <div className="form-group pt-2">
                            <div className="input-group">
                                <button type="submit" onClick={onSubmit} className="btn btn-block btn-warning" disabled={question.loading || question.success}>Add Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default QuestionAddComponent
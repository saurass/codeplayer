import React, { useState, useEffect } from "react";
import { createContest } from "../../../services/contest/contest";
import { Redirect } from "react-router-dom";

const ContestCreateComponent = () => {

    const [contest, setContest] = useState({
        contestName: "",
        startTime: "",
        endTime: "",

        error: "",
        loading: false,
        redirect: false
    })

    const handlechange = name => event => {
        setContest({ ...contest, [name]: event.target.value });
    }

    const onLoading = () => {
        return contest.loading && <p className="text-center text-warning font-weight-bold">Please Wait...</p>
    }

    const errorMessage = () => {
        return contest.error && <p className="text-center text-danger font-weight-bold">{contest.error}</p>
    }

    const localTimeToTS = (localTime) => {
        let time = new Date(localTime);
        return time.getTime();
    }

    const onSubmit = (event) => {
        event.preventDefault();
        setContest({ ...contest, loading: true });

        let createdTest = {};
        createdTest.name = contest.contestName;
        createdTest.starttime = localTimeToTS(contest.startTime);
        createdTest.endtime = localTimeToTS(contest.endTime);
        createContest(createdTest)
            .then(data => {
                if (data.error) {
                    setContest({ ...contest, error: data.error, loading: false })
                } else {
                    setContest({ ...contest, success: true, loading: false, redirect: true, error: "" });
                }
            })
            .catch(err => {
                setContest({ ...contest, loading: false, error: "Please Check Your Internet Connection" })
                console.log(err);
            })
    }

    const localTimeZone = () => {
        let d = new Date();
        let offset = d.getTimezoneOffset();
        let sign = offset < 0 ? "+" : "-";
        offset = Math.abs(offset);
        let h = Math.floor(offset / 60);
        let m = (offset / 60 - h) * 60;
        return `${sign}${h}:${m}`

    }

    const redirectIfCreated = () => {
        if (contest.redirect) {
            return <Redirect to={{
                pathname: "/contests",
                state: {
                    redirectMsg: {
                        type: "info",
                        message: "Contest Created"
                    }
                }
            }} />
        }
    }

    return (
        <div className="row min-height-fix-footer mx-0 my-5">
            {redirectIfCreated()}
            <div className="col-md-4 offset-md-4 align-self-center">

                <div className="card">

                    <div className="card-body">
                        <h5 className="text-center pb-3">Create Contest</h5>
                        {onLoading()}
                        {errorMessage()}
                        <div className="form-group">
                            <span class="input-label">Contest Name</span>
                            <div className="input-group">
                                <input type="text" className="form-text form-control" onChange={handlechange("contestName")} placeholder="Contest Name" />
                            </div>
                        </div>
                        <div className="form-group">
                            <span class="input-label">Start Time  (UTC {localTimeZone()})</span>
                            <div className="input-group">
                                <input type="datetime-local" placeholder="Start Time" onChange={handlechange("startTime")} className="form-text form-control" />
                            </div>
                        </div>
                        <div className="form-group">
                            <span class="input-label">End Time  (UTC {localTimeZone()})</span>
                            <div className="input-group">
                                <input type="datetime-local" placeholder="End Time" onChange={handlechange("endTime")} className="form-text form-control" />
                            </div>
                        </div>
                        <div className="form-group pt-2">
                            <div className="input-group">
                                <button type="submit" onClick={onSubmit} className="btn btn-block btn-warning" disabled={contest.loading || contest.success}>Create Contest</button>
                            </div>
                        </div>
    <p>{JSON.stringify(contest)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContestCreateComponent;
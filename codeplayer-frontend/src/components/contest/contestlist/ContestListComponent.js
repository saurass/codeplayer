import React, { useState, useEffect } from "react";
import "./ContestListComponent.css"
import { Link, withRouter } from "react-router-dom";
import { getAllContest, deleteContest } from "../../../services/contest/contest";
import { humanDateFormat } from "../../../services/humanDateFormat";
import notify from "../../../services/toast/Toast";
import { isAuthenticated } from "../../../services/auth/auth";

const ContestListComponent = (props) => {

    const [allContest, setAllContest] = useState({
        contest: [],

        loading: true,
        success: false,
        error: "",
    })

    useEffect(() => {
        fetchAllContest()
    }, []);

    const fetchAllContest = () => {
        getAllContest()
            .then(data => {
                if (data.error) {
                    setAllContest({ ...allContest, error: data.error, loading: false })
                } else {
                    setAllContest({ ...allContest, contest: data.contests, success: true, loading: false, redirect: true, error: "" });
                }
            })
            .catch(err => {
                setAllContest({ ...allContest, loading: false, error: "Please Check Your Internet Connection" })
            })
    }

    const onLoading = () => {
        return allContest.loading && <p className="text-center text-warning font-weight-bold">Please Wait...</p>
    }

    const errorMessage = () => {
        return allContest.error && <p className="text-center text-danger font-weight-bold">{allContest.error}</p>
    }

    const getTimeLength = (starttime, endtime) => {
        return humanDateFormat(starttime, endtime);
    }

    const deleteOneContest = (contest) => {
        console.log(contest)
        setAllContest({ ...allContest, error: "", loading: true })
        if(contest.organiser == true) {
            deleteContest(contest.id)
                .then(data => {

                    if (data.error) {
                        setAllContest({ ...allContest, error: data.error, loading: false })
                    } else {
                        setAllContest({ ...allContest, loading: false});
                        notify("info", "Contest Deleted")
                        fetchAllContest()
                    }
                
                })
                .catch(err => {
                    setAllContest({ ...allContest, loading: false, error: "Please Check Your Internet Connection" })
                })

        } else {
            notify("warn", "Not Allowed")
        }
    }

    const organiserOption = (contest) => {
        return contest.organiser && <button className="btn btn-danger mr-2 float-right" onClick={() => {deleteOneContest(contest)}}>Delete</button>
    }

    const contestCard = (contest) => {
        let linktocontest = "/contest/" + contest.id;
        return (
            <div className="card mb-4" key={contest.id}>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-3"><span className="contest-name">{contest.name}</span></div>
                        <div className="col-md-3"><span className="contest-name">{getTimeLength(contest.starttime, contest.endtime)}</span></div>
                        <div className="col-md-3"><span className="contest-name">{contest.numberOfTasks}</span></div>
                        <div className="col-md-3">
                            <Link to={{
                                pathname: linktocontest,
                                state: {
                                    organiser: contest.organiser
                                }
                            }}><button className="btn btn-warning float-right">Enter</button></Link>
                            {organiserOption(contest)}
                        </div>
                    </div>


                </div>
            </div>
        )
    }

    const contestList = () => {
        return allContest.contest.map(contestCard);
    }

    const createContestBtn = () => {
        let isAuth = isAuthenticated();
        return  isAuth && (isAuth.user.role == 0 || isAuth.user.role == 1) && <div className="row mx-0 my-4">
            <div className="container">
                <Link to="/contest/create"><button className="btn btn-success float-right">Create Contest</button></Link>
            </div>
        </div>
    }

    return (
        <div className="min-height-fix-footer mx-0 my-5">
            {createContestBtn()}
            <div className="row mx-0">
                <div className="container">
                    {onLoading()}
                    {errorMessage()}

                    {contestList()}

                </div>
            </div>
        </div>
    );
}

export default withRouter(ContestListComponent);
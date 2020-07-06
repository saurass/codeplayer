import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getLeaderBoard } from "../../services/leaderboard/leaderboard";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { isAuthenticated } from "../../services/auth/auth";
import { humanPreciseDateFormat } from "../../services/humanDateFormat";
import "./LeaderBoardComponent.css"

const LeaderBoardComponent = () => {

    const [board, setBoard] = useState({
        loading: true,
        error: "",
        
        questions: [],
        leaderboard: {},
        contest: {}
    });

    const {contestId} = useParams();

    useEffect(() => {
        fetchLeaderBoard(contestId);
    }, []);

    const fetchLeaderBoard = (contestId) => {
        getLeaderBoard(contestId)
            .then(data => {

                if (data.error) {
                    setBoard({ ...board, error: data.error, loading: false })
                } else {
                    setBoard({ ...board, questions: data.questions, leaderboard: data.leaderboard, contest: data.contest, loading: false, error: "" });
                }
            
            })
            .catch(err => {
                setBoard({ ...board, loading: false, error: "Please Check Your Internet Connection" })
            })
    }

    const onLoading = () => {
        return board.loading && <p className="text-center text-warning font-weight-bold">Please Wait...</p>
    }

    const errorMessage = () => {
        return board.error && <p className="text-center text-danger font-weight-bold">{board.error}</p>
    }

    const questionAllHeaders = () => {
        if(board.questions.length > 0) {
            let i = 1;
            return <React.Fragment><th>User Name</th><th>Penality</th> {
                    board.questions.map((question) => {
                    let queslink = `/question/${question}`;
                    return <th scope="col" className="text-center"><Link to={queslink} target="_blank">#{i++}</Link></th>
                })
            }</React.Fragment>
        }
    }

    const userPenalty = (user) => {
        let calcPenalty = (board.leaderboard[user].maxtime - board.contest.starttime) + board.leaderboard[user].penalty * 5 * 60 * 1000
        if(calcPenalty != 0) {
            let retval = calcPenalty / 60000
            return retval.toFixed(2);
        } else {
            return "";
        }
        // if(board.leaderboard[user].maxtime != 0 && board.contest.starttime < board.leaderboard[user].maxtime)
        //     return humanPreciseDateFormat(board.contest.starttime, board.leaderboard[user].maxtime)
        // else
        //     return "";
    }

    const userRankList = () => {
        if(Object.keys(board.leaderboard).length) {
            let rk = 1;
            return Object.keys(board.leaderboard).map((user) => {
                // rk++;
                let trClass = isAuthenticated().user.username == user ? "table-info" : "";
                return <tr className={trClass}> <td>{rk++}</td> <td>{user}</td> <td>{userPenalty(user)}</td> {
                    board.questions.map((question) => {
                        if(board.leaderboard[user].verdict[question]) {
                            let userAtt = board.leaderboard[user].verdict[question].attempts;
                            userAtt = userAtt == 0 ? "" : userAtt;
                            if(board.leaderboard[user].verdict[question].verdict == "AC") {
                                return <td className="text-center text-success align-items-center">+{userAtt}<br /><span className="donetime text-muted">{humanPreciseDateFormat(board.contest.starttime, board.leaderboard[user].verdict[question].donetime)}</span></td>
                            } else {
                                if(userAtt)
                                    return <td className="text-center text-danger">-{userAtt}</td>
                                else
                                    return <td></td>
                            }
                        } else {
                            return <td></td>
                        }
                    })

                }</tr>
            });
            
        }
    }

    return <div className="min-height-fix-footer container">
        <h1 className="text-center mt-4">Leader Board</h1>
        {onLoading()}
        {errorMessage()}
        <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    {questionAllHeaders()}
                    </tr>
                </thead>
                <tbody>
                    {userRankList()}
                    {/* <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    </tr>
                    <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    </tr>
                    <tr>
                    <th scope="row">3</th>
                    <td>Larry</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                    </tr> */}
                </tbody>
            </table>
        </div>
    </div>
}

export default LeaderBoardComponent
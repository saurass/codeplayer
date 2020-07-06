import { isAuthenticated } from "../auth/auth";

const { API } = require("../backend");

export const getLeaderBoard = (contestId) => {
    return fetch(`${API}/leaderboard/${contestId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + isAuthenticated().token
        }
    })
        .then(response => (response.json()))
        .catch(err => ({ error: "Please Check Your Internet Conenction" }));
}
import { isAuthenticated } from "../auth/auth";

const { API } = require("../backend");

export const getRawInput = (questionId, testcaseId) => {
    return fetch(`${API}/testcase/input/raw/${questionId}/${testcaseId}`, {
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

export const getRawOutput = (questionId, testcaseId) => {
    return fetch(`${API}/testcase/output/raw/${questionId}/${testcaseId}`, {
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
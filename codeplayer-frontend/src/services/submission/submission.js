import { isAuthenticated } from "../auth/auth";

const { API } = require("../backend");

export const createSubmission = (questionId, data) => {
    return fetch(`${API}/submission/create/${questionId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + isAuthenticated().token
        },
        body: JSON.stringify({ code: data.code, lang: data.language })
    })
        .then(response => (response.json()))
        .catch(err => ({ error: "Please Check Your Internet Conenction" }));
}
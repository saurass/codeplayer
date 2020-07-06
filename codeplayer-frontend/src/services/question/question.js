import { isAuthenticated } from "../auth/auth";

const { API } = require("../backend");

export const createQuestion = (question, contestId) => {
    let formData = new FormData();
    formData.append("name", question.name);
    formData.append("statement", question.statement);
    formData.append("memorylimit", question.memorylimit);
    formData.append("timelimit", question.timelimit);

    console.log(formData);

    return fetch(`${API}/question/create/${contestId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Authorization": "Bearer " + isAuthenticated().token
        },
        body: formData
    })
        .then(response => (response.json()))
        .catch(err => ({ error: "Please Check Your Internet Conenction" }));
}

export const deleteQuestion = (questionId) => {
    return fetch(`${API}/question/statement/${questionId}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + isAuthenticated().token
        }
    })
        .then(response => (response.json()))
        .catch(err => ({ error: "Please Check Your Internet Conenction" }));
}

export const getQuestionStatement = (questionId) => {
    return fetch(`${API}/question/statement/${questionId}`, {
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
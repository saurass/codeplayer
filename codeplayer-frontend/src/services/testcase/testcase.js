import { isAuthenticated } from "../auth/auth";

const { API } = require("../backend");

export const getQuestionAndTestCase = (questionId) => {
    return fetch(`${API}/testcase/${questionId}`, {
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

export const createTestCase = (questionId, testcase) => {
    let formData = new FormData();
    formData.append("input", testcase.input);
    formData.append("output", testcase.output);

    return fetch(`${API}/testcase/create/${questionId}`, {
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

export const deleteOneTestCase = (questionId, testcaseId) => {
    return fetch(`${API}/testcase/delete/${questionId}/${testcaseId}`, {
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
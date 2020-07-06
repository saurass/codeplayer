import { isAuthenticated } from "../auth/auth";

const { API } = require("../backend");

export const createOrder = (amount) => {
    return fetch(`${API}/donation/order`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + isAuthenticated().token
        },
        body: JSON.stringify({amount: amount})
    })
        .then(response => (response.json()))
        .catch(err => ({ error: "Please Check Your Internet Conenction" }));
}

export const verifyDonation = (response) => {
    return fetch(`${API}/donation/verify`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + isAuthenticated().token
        },
        body: JSON.stringify({response: response})
    })
        .then(response => (response.json()))
        .catch(err => ({ error: "Please Check Your Internet Conenction" }));
}
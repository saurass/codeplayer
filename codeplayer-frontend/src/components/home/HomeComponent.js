import React, { useEffect, useState } from "react";
import "./HomeComponent.css";
import logo from '../../assets/images/logo/logo.svg';
import { IconContext } from "react-icons";
import { DiPython } from "react-icons/di";
import { FaCuttlefish } from "react-icons/fa";
import {createOrder, verifyDonation} from "../../services/donation/donation";
import { Redirect, Link } from "react-router-dom/cjs/react-router-dom.min";
import $ from "jquery";
import "bootstrap/dist/js/bootstrap.min.js";

function HomeComponent() {
    const [donation, setDonation] = useState({
        amount: 100,
        loading: false,
        error: "",
        order_id: "",
        redirect: false,
        redirectUrl: "/thankyou"
    });

    useEffect(() => {
        $('#paymentModal').on('show.bs.modal', function (event) {
            var modal = $(this)
        })
        loadRazorPayScript();
    }, [])

    const loadRazorPayScript = () => {
        const src = "https://checkout.razorpay.com/v1/checkout.js";
        let script = document.createElement("script");
        script.src = src;
        document.body.appendChild(script);
    }

    const displayRazorpay = () => {
        let options = {
            "key": process.env.REACT_APP_RAZORPAY_API_ID,
            "amount": donation.amount * 100,
            "currency": "INR",
            "name": "CodePlayer",
            "description": "Buy a Coffee",
            "image": logo,
            "order_id": donation.order_id,
            "handler": function (response) {
                console.log(response)
                verifyDonation(response)
                    .then((data) => {
                        if(data.success == true) {
                            setDonation({...donation, redirectUrl: "/thankyou", redirect: true, order_id: ""});
                        } else {
                            setDonation({...donation, redirectUrl: "/paymentfail", redirect: true, order_id: ""});
                        }
                    })
                    .catch(err => {
                        setDonation({...donation, redirectUrl: "/paymentfail", redirect: true, order_id: ""});
                    })
                $(".modal-backdrop").remove();
                let body = document.getElementsByTagName("body")[0];
                body.removeAttribute("class")
                body.removeAttribute("style")
            },
            "theme": {
                "color": "#343a40"
            }
        };
        let rzp = null;
        try {
            rzp = new window.Razorpay(options)
        } catch(error) {
            console.log("Loading razorpay...")
        }
        setTimeout(() => {
            rzp.open();
        }, 1000)
    }

    const autoCallRazorPay = () => {
        if(donation.order_id) {
            displayRazorpay();
        }
    }

    autoCallRazorPay();

    const handlechange = name => event => {
        setDonation({...donation, amount: event.target.value});
    }

    const onRedirect = () => {
        return donation.redirect && <Redirect to={donation.redirectUrl}></Redirect>
    }

    const onSubmit = (event) => {
        event.preventDefault();
        setDonation({...donation, error: "", loading: true});
        createOrder(donation.amount)
        .then(data => {
            if(data.error) {
                setDonation({...donation, loading: false, error: data.error});
            } else {
                setDonation({...donation, loading: false, order_id: data.order_id});
            }
        })
        .catch(err => {
            console.log(err);
            setDonation({ ...donation, loading: false, error: "Please Check Your Internet Connection" })
        })
    }

    const onLoading = () => {
        return donation.loading && <p className="text-center text-warning font-weight-bold">Please Wait...</p>
    }

    const errorMessage = () => {
        return donation.error && <p className="text-center text-danger font-weight-bold">{donation.error}</p>
    }

    return (

        <div>
            {onRedirect()}
            <div className="modal" id="paymentModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Please Enter Amount In INR</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-12">
                                {onLoading()}
                                {errorMessage()}
                                <div className="form-group">
                                    <span className="input-label">Enter Amount</span>
                                    <div className="input-group">
                                        <input type="number" className="form-control" onChange={handlechange("amount")} placeholder="Please Enter a Valid Amount in Rs"></input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        {/* <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button> */}
                        <button onClick={onSubmit} type="button" className="btn btn-warning" disabled={donation.loading}>Proceed</button>
                    </div>
                    </div>
                </div>
            </div>

            <div className="jumbotron jumbotron-fluid bg-dark text-light">
                <div className="container">
                    <h1 className="display-4">Code Player</h1>
                    <p className="lead">The ultimate code gaming platform for geeky coders</p>

                    <div className="align-items-center text-center my-5">
                        <h2 className="py-3">Like What We do ?</h2>
                        <button className="btn btn-lg btn-warning text-light" data-toggle="modal" data-target="#paymentModal">Buy Me A Coffee ?</button>

                        <h4 className="text-center mt-5">Want to create Contest? <a className="text-decoration-none" href="http://saurass.in" target="_blank"><span className="contact-me">Contact me !</span></a></h4>

                    </div>
                </div>
            </div>

            <div className="container justify-content-center text-center py-5">
                <h1>Hello World</h1>
            </div>

            <div className="container">
                <div className="row">
                    <div className="col-md-6 col-sm-12 justify-content-center">
                        <h2>We Speak 2 Languages</h2>
                        <p>We respect all the languages, but speak only few.</p>

                        <ul className="hideBulletInli">
                            
                            <li className="d-flex align-items-center my-4">
                                {/* <i className="fab fa-cuttlefish fa-4x mr-4"></i> */}
                                <IconContext.Provider value={{ size: "4em" }}>
                                    <FaCuttlefish className="mr-4" />
                                </IconContext.Provider>
                                <span>C/C++ for all those competitors out there.</span>
                            </li>

                            <li className="d-flex align-items-center my-4">
                                {/* <i className="fab fa-python fa-4x mr-4"></i> */}
                                <IconContext.Provider value={{ size: "4em" }}>
                                    <DiPython className="mr-4" />
                                </IconContext.Provider>
                                <span>python3 for all open source enthusiasts</span>
                            </li>
                            
                        </ul>

                    </div>
                    <div className="col-md-6 col-sm-12 d-flex justify-content-center align-items-center">
                        <div className="container align-items-center">
                            <img alt="Hope never dies" className="right-logo" src={logo}></img>
                            <h2 className="text-center mt-3">Big Steps Begin with Small Steps</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeComponent
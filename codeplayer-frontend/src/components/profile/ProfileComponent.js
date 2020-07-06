import React from "react";
import logo from '../../assets/images/logo/logo.svg';
import { withRouter } from "react-router-dom";

function ProfileComponent(props) {
    console.log(props)
    return (
        <div className="min-height-fix-footer mx-0">
            <div className="container">
                <div className="row my-5">
                    <div className="col-md-4">

                        <div className="card mb-4">
                            <div className="card-header">
                                Basic Profile
                    </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-4 py-2">

                                        <img src={logo} alt="100x100" className="rounded-circle dp-profile img-fluid" data-holder-rendered="true"></img>

                                    </div>
                                    <div className="col-md-8 py-2">
                                        <h6>Saurabh Srivastava</h6>
                                        <p>saurass</p>
                                    </div>
                                </div>
                                <ul className="list-group list-group-flush row">
                                    <li className="list-group-item">Website <span className="float-right">https://saurass.in</span></li>
                                    <li className="list-group-item">Location <span className="float-right">India</span></li>
                                    <li className="list-group-item">Comapny <span className="float-right">OSSRNDC</span></li>
                                </ul>

                            </div>
                        </div>

                        <div className="card mb-4">
                            <div className="card-header">
                                Contest
                    </div>
                            <div className="card-body">
                                <ul className="list-group list-group-flush row">
                                    <li className="list-group-item">Finished Contest<span className="float-right badge badge-pill badge-success">3</span></li>
                                    <li className="list-group-item">Rating<span className="float-right badge badge-pill badge-success">1617</span></li>
                                    <li className="list-group-item">Global Ranking<span className="float-right badge badge-pill badge-success">500/1000</span></li>
                                </ul>

                            </div>
                        </div>

                    </div>
                    <div className=" col-md-8">

                        <div className="card mb-4">
                            <div className="card-header">
                                Contest Progress
                    </div>
                            <div className="card-body">


                            </div>
                        </div>

                        <div className="card mb-4">
                            <div className="card-header">
                                Recent Submissions
                    </div>
                            <div className="card-body">
                                <ul className="list-group list-group-flush row">
                                    <li className="list-group-item">Website <span className="float-right">https://saurass.in</span></li>
                                    <li className="list-group-item">Location <span className="float-right">India</span></li>
                                    <li className="list-group-item">Comapny <span className="float-right">OSSRNDC</span></li>
                                </ul>

                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
}

export default withRouter(ProfileComponent);
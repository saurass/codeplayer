import React from 'react';
import logo from '../../../assets/images/logo/logo.svg';
import "./NavComponent.css";
import { withRouter, Link } from 'react-router-dom';
import { isAuthenticated } from '../../../services/auth/auth';
import $ from "jquery"

const NavComponent = (props) => {

    let navBorderClass = "container";
    if (props.location.pathname === '/') {
        navBorderClass = "container border-bottom";
    }

    const toggleCollapse = () => {
        $('.navbar-collapse').collapse('hide');
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className={navBorderClass}>
                <Link onClick={toggleCollapse} className="navbar-brand" to="/">
                    <div className="row ml-1">
                        <img alt="CodePlayer" className="logo-img ml-2 mt-1" src={logo} />
                        <div className="d-inline-block ml-2">
                            <span className="d-inline text-danger">Code Player</span>
                            <span className="d-block logo-info">Era Of Code Games</span>
                        </div>
                    </div>
                </Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto">
                        {!isAuthenticated() && (
                            <React.Fragment>
                                <li className="nav-item" onClick={toggleCollapse}>
                                    <Link className="nav-link" to="/signin">Sign In</Link>
                                </li>
                                <li className="nav-item" onClick={toggleCollapse}>
                                    <Link className="nav-link" to="/signup" aria-disabled="true">Sign Up</Link>
                                </li>
                            </React.Fragment>
                        )}
                        {isAuthenticated() && (
                            <React.Fragment>
                                <li className="nav-item" onClick={toggleCollapse}>
                                    <Link className="nav-link" to="/contests">Contest</Link>
                                </li>
                                {/* <li className="nav-item">
                                    <Link className="nav-link" to="/profile">Profile</Link>
                                </li> */}
                                <li className="nav-item" onClick={toggleCollapse}>
                                    <Link className="nav-link" to="/logout">Logout</Link>
                                </li>
                            </React.Fragment>
                        )}
                    </ul>
                </div>
            </div>
        </nav >
    );
}

export default withRouter(NavComponent);
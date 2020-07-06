import React from 'react';
import { withRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

function FooterComponent(props) {
    let footerClass = "col-md-12 py-4 bg-dark text-white";
    if (props.location.pathname === '/') {
        footerClass = "col-md-12 py-4 bg-dark text-white mt-5";
    }
    return (
        <footer className={footerClass}>
            <ToastContainer />
            <div className="container text-center">
                Made with &#9829; By <a href="http://saurass.in" target="_blank" className="text-decoration-none text-warning">Saurabh Srivastava</a>
        </div>
        </footer>
    );
}

export default withRouter(FooterComponent);
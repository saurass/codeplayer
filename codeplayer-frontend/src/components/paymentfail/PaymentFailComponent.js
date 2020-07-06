import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const PaymentFailComponent = () => {
    return (
        <div className="min-height-fix-footer row d-flex mx-0 justify-content-center align-items-center">
            <h1>Payment Failed !!!</h1>
            <Link to="/"><button className="btn btn-lg btn-warning ml-3">Retry</button></Link>
        </div>
    );
}

export default PaymentFailComponent;
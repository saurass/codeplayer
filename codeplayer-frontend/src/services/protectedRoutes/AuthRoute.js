import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth/auth";
import notify from "../toast/Toast";

const AuthRoute = ({ children, ...rest }) => {
    if(!isAuthenticated())
        notify("info", "Please Login To Continue")
    return (
        <Route
            {...rest}
            render={({ location }) =>
                isAuthenticated() ? (
                    children
                ) : (
                        <Redirect
                            to={{
                                pathname: "/signin",
                                state: {
                                    from: location
                                }
                            }}
                        />
                    )
            }
        />
    );
}

export default AuthRoute;
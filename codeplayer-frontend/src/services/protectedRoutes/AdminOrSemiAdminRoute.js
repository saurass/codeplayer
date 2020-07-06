import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth/auth";
import notify from "../toast/Toast";

const AdminOrSemiAdminRoute = ({ children, ...rest }) => {
    let isAuth = isAuthenticated();
    let decision = isAuth ? isAuth.user.role == 0 || isAuth.user.role == 1 : false;
    if(!decision)
        notify("warn", "Not Authorized")
    return (
        <Route
            {...rest}
            render={({ location }) =>
                decision ? (
                    children
                ) : (
                        <Redirect
                            to={{
                                pathname: "/",
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

export default AdminOrSemiAdminRoute;
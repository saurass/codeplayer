import React, {useContext} from "react";
import { Redirect } from "react-router-dom";
import { signout } from "../../../services/auth/auth";
import {GlobalContext} from "../../../context/GlobalContext";
import notify from "../../../services/toast/Toast"

const LogoutComponent = () => {
    const [globals, setGlobals] = useContext(GlobalContext);
    
    signout()
    .then(() => {
        notify("info", "Logged Out");
        if(globals.socket != null)
            globals.socket.close();
        setGlobals({...globals, socket: null, loggedIn: false});
    })

    const redirectOnLogOut = () => {
        return !globals.loggedIn && <Redirect to={{
                                    pathname: "/"
                                }} />
    }

    return (
        <React.Fragment>
            {redirectOnLogOut()}
        </React.Fragment>
    );
}

export default LogoutComponent;
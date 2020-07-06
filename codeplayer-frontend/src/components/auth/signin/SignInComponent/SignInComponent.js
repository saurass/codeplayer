import React, { useState, useContext } from "react";
import logo from '../../../../assets/images/logo/logo.svg';
import { signIn, authenticate, isAuthenticated } from "../../../../services/auth/auth";
import { Redirect } from "react-router-dom";
import connectToSocketServer from "../../../../services/socket";
import {GlobalContext} from "../../../../context/GlobalContext";
import notify from "../../../../services/toast/Toast"

function SignInComponent() {
    const [globals, setGlobals] = useContext(GlobalContext);
    const [user, setUser] = useState({
        username: "",
        password: "",
        loading: false,
        error: "",
        success: false,
        redirect: isAuthenticated()
    });

    const handlechange = name => event => {
        setUser({ ...user, [name]: event.target.value });
    }

    const onLoading = () => {
        return user.loading && <p className="text-center text-warning font-weight-bold">Please Wait...</p>
    }

    const redirectIfAuthenticated = () => {
        if (user.redirect) {
            return <Redirect to={{
                pathname: "/"
            }} />
        }
    }

    const errorMessage = () => {
        return user.error && <p className="text-center text-danger font-weight-bold">{user.error}</p>
    }

    const onSubmit = event => {
        event.preventDefault();
        user.loading = true;
        setUser({ ...user, error: "" })
        signIn(user)
            .then(data => {
                if (data.error) {
                    setUser({ ...user, loading: false, error: data.error })
                } else {
                    authenticate(data, () => {
                        setUser({ ...user, loading: false, error: "", success: true, redirect: true })
                        notify("success", "Welcome, " + isAuthenticated().user.username)               
                        let scio = connectToSocketServer();
                        setGlobals({...globals, socket: scio, loggedIn: true})
                        scio.on("update", msg => {
                            setGlobals({...globals, verdict: msg})
                        })
                    });
                }
            })
            .catch(err => {
                setUser({ ...user, loading: false, error: "Please Check Your Internet Connection" })
                console.log(err);
            })
    }

    return (

        < div className="row min-height-fix-footer mx-0" >
            {redirectIfAuthenticated()}
            <div className="col-md-4 offset-md-4 align-self-center">

                <div className="card">

                    <div className="card-body">
                        <div className="row justify-content-center align-content-center py-4">
                            <img className="logo-img mt-1" alt="CodePlayer" src={logo} />
                            <div className="d-inline-block ml-2">
                                <span className="d-inline text-danger">Code Players</span>
                                <span className="d-block" >Era Of Code Games</span>
                            </div>
                        </div>
                        <h5 className="text-center pb-3">Login Here</h5>
                        {onLoading()}
                        {errorMessage()}
                        <div className="form-group">
                            <span class="input-label">Username</span>
                            <div className="input-group">
                                <input type="text" className="form-text form-control" onChange={handlechange("username")} placeholder="Username" name="name" />
                            </div>
                        </div>
                        <div className="form-group">
                            <span class="input-label">Password</span>
                            <div className="input-group">
                                <input type="password" placeholder="Password" onChange={handlechange("password")} className="form-text form-control" name="name" />
                            </div>
                        </div>
                        <div className="form-group pt-2">
                            <div className="input-group">
                                <button type="submit" onClick={onSubmit} className="btn btn-block btn-warning" disabled={user.loading || user.success}>Login</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default SignInComponent;
const User = require("../models/user");
const { check, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { ers } = require("./error");
const request = require("request");

/*
|------------------------------------------------------
|   SignUp Controller
|------------------------------------------------------
*/
exports.signup = (req, res) => {
    // check for entries in routes (please look at auth routes for details)
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(422).json({
            error: error
        })
    }
    console.log(req.body)
    let options = {
        uri: "https://www.google.com/recaptcha/api/siteverify",
        method: "POST",
        headers: {"content-type": "application/json"},
        form: {
            secret: process.env.RECAPTCHA_SECRET,
            response: req.body.recaptcha
        },
        json: true
    }


    request.post(options, (error, response, body) => {
        if(error) {
            return ers(res, 400, "Unable to verify Your Captcha")
        }
        if(body.success != undefined && !body.success) {
            return ers(res, 400, "You are not a Human Sir !!!")
        }

        // Create new user
        const user = new User(req.body);
        user.save((err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "Registration failed, UserName & email should be unique"
                });
            }

            // returning new details of user to frontend
            return res.json({
                fullname: user.fullname,
                email: user.email,
                username: user.username,
                id: user._id
            });
        });
    })
}

/*
|------------------------------------------------------
|   SignIn Controller
|------------------------------------------------------
*/
exports.signin = (req, res) => {
    // check for entries
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(422).json({
            error: error.array()[0].msg
        })
    }
    const { username, password } = req.body;

    // search for user registered with this email
    User.findOne({ username }, (err, user) => {
        // if no user with email found
        if (err || !user) {
            return res.status(400).json({
                error: "User not found"
            });
        }

        // if password dosen't match
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Username or password is Wrong"
            });
        }

        // authenticated
        // create token using a SECRET key only acessible to us
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);
        // set cookie - a session for login will be left on server
        res.cookie("token", token, { expire: new Date() + 99999 });
        // send response to frontend
        const { _id, name, email, username, role } = user;
        return res.status(200).json({ token, user: { _id, name, email, username, role } });
    })
}

/*
|------------------------------------------------------
|   SignOut Controller
|------------------------------------------------------
*/
exports.signout = (req, res) => {
    res.clearCookie();
    res.json({
        name: "Logout success !!!"
    });
}

// MiddleWares
// JWT verification, it will add auth property to the req
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
});

// To check if we are dealing with same user
exports.isAuthenticated = (req, res, next) => {
    console.log(req);
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
        return res.status(403).json({
            error: "Not Authorized"
        });
    }
    next();
}

// Admin middleware
exports.isAdmin = (req, res, next) => {
    if (req.profile.role != 0) {
        return res.status(403).json({
            error: "Not Authorized"
        });
    }
    next();
}


// 0 - admin
// 1 - semiadmin
// Admin or SeminAdmin middleware
exports.isAdminOrSemiAdmin = (req, res, next) => {
    if (!(req.profile.role == 0 || req.profile.role == 1)) {
        return ers(res, 403, "You are not Authorized !!");
    }
    next();
}
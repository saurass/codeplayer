const User = require("../models/user");

exports.getUserById = (req, res, next) => {
    User.findById(req.auth._id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "You do not exist Sir !"
            })
        }

        req.profile = user;
        next();
    });
}
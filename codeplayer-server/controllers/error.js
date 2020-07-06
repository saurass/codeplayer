exports.ers = (res, status, errmsg) => {
    return res.status(status).json({
        error: errmsg
    });
}
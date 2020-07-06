
exports.createResponseObject = (obj, keys) => {
    let retval = {};
    keys.map((key) => {
        retval[key] = obj[key];
    })

    return retval;
}
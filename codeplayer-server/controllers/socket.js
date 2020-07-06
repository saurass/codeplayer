const submissionController = require("./submission");

const registerSocketListeners = (io, socket) => {
    socket.on('joinroom', msg => {
        let roomname = msg;
        socket.join(roomname)
    })

    socket.on('leaveroom', msg => {
        let roomname = msg;
        socket.leave(roomname)
    })

    socket.on('status', msg => {
        msg = JSON.parse(msg);
        // submissionId
        submissionController.updateSubmissionStatus(msg)
        io.to(msg.userId).emit('update', msg);
    })
}

module.exports = registerSocketListeners;
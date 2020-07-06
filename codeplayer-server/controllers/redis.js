const RedisSMQ = require("rsmq");

exports.push = (queueName, message) => {
    const rsmq = new RedisSMQ( {host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, ns: "rsmq"} );
    rsmq.sendMessage({ qname: queueName, message: message}, function (err, resp) {
        rsmq.quit();
    });
}
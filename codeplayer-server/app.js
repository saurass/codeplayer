require("dotenv").config();
const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const contestRoutes = require("./routes/contest")
const questionRoutes = require("./routes/question")
const testRoutes = require("./routes/testcase")
const submissionRoutes = require("./routes/submission")
const workerRoutes = require("./routes/worker")
const leaderBoardRoutes = require("./routes/leaderboard")
const donationRoutes = require("./routes/donation")
const redisAdapter = require("socket.io-redis");
const registerSocketListeners = require("./controllers/socket");

// Boot
const app = express();
app.set('port', process.env.PORT || 4000);

// Database
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("bravo database connected ........")
})

// App config
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Auth Routes
app.use("/api", authRoutes);
app.use("/api/contest", contestRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/testcase", testRoutes);
app.use("/api/submission", submissionRoutes);
app.use("/api/leaderboard", leaderBoardRoutes);
app.use("/api/donation", donationRoutes);
app.use("/worker", workerRoutes);
app.use((req, res) => {
    return res.status(404).json({ error: "Not Found" })
});

// Start server
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log("running server...", port);
});

const io = require("socket.io")(server);
io.adapter(redisAdapter({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT }));

// Start Socket IO Listener
io.on('connection', (socket) => {
    registerSocketListeners(io, socket)
})
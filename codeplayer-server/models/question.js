const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

var questionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    memorylimit: {
        type: Number,
        required: true,
        trim: true
    },
    timelimit: {
        type: Number,
        required: true,
        trim: true
    },
    testcase: {
        type: Array,
        default: []
    },
    sampletestcase: {
        type: Array,
        default: []
    },
    user: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    contest: {
        type: ObjectId,
        ref: "Contest",
        required: true
    }
}, { timestamps: true });

questionSchema.virtual('statement')
    .get(function () {
        return `questions/${this._id}.txt`;
    });

module.exports = mongoose.model("Question", questionSchema);
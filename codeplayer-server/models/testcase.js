var mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

var testcaseSchema = mongoose.Schema({
    input: {
        type: String,
        required: true
    },
    output: {
        type: String,
        required: true
    },
    question: {
        type: ObjectId,
        ref: "Question",
        required: true,
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
});

module.exports = mongoose.model("Testcase", testcaseSchema);
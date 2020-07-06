const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

var submissionSchema = new mongoose.Schema({
    language: {
        type: String,
        required: true
    },
    question: {
        type: ObjectId,
        ref: "Question",
        required: true,
    },
    user: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    username: {
        type: String,
        required: true
    },
    submittime: {
        type: Number,
        required: true
    },
    verdict: {
        type: String,
        default: "WJ"
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

submissionSchema.virtual("submission")
    .get(function () {
        return `submissions/${this.user}/${this.question}/${this._id}.code`;
    })

module.exports = mongoose.model("Submission", submissionSchema);
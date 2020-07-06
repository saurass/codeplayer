const mongoose = require("mongoose");

var contestSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    starttime: {
        type: Number,
        trim: true,
        required: true
    },
    endtime: {
        type: Number,
        trim: true,
        required: true
    },
    questions: {
        type: Array,
        default: []
    },
    organiser: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
})

contestSchema.virtual("numberOfTasks")
    .get(function () {
        return this.questions.length;
    });

contestSchema.methods = {
    isContestStarted: function() {
        let now = new Date();
        now = now.getTime();
        if(now >= this.starttime) {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = mongoose.model("Contest", contestSchema);
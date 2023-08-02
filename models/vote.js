const mongoose = require("mongoose");
const schema = mongoose.Schema;
var vote = new schema(
    {
        userIds: [{
            type: mongoose.Types.ObjectId,
            ref: "user"
        }],
        adId: {
            type: mongoose.Types.ObjectId,
            ref: "ads"
        },
        count: {
            type: String
        },
        voteCount: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ["ACTIVE", "BLOCK", "DELETE"],
            default: "ACTIVE"
        },
    }, { timestamps: true }
);

module.exports = mongoose.model("votes", vote);

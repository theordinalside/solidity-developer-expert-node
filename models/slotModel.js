const mongoose = require("mongoose");
const schema = mongoose.Schema;
var slot = new schema(
    {
        userId: {
            type: String
        },
        startDate: {
            type: String
        },
        endDate: {
            type: String
        },
        inscription: {
            type: Number
        },
        title: {
            type: String
        },
        url: {
            type: String
        },
        clickTags: {
            type: String
        },
        info: {
            type: String
        },
        status: {
            type: String,
            enum: ["ACTIVE", "INACTIVE"],
            default: "ACTIVE"
        },
        buyLimit: {
            type: Number,
            default: 3
        },
        updated: { type: Boolean, default: false },
        suffled: { type: Boolean, default: false },
        position: { type: Number, default: 0 }

    }, { timestamps: true }
);

module.exports = mongoose.model("slots", slot);

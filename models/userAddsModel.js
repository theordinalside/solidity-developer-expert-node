const mongoose = require("mongoose");
const schema = mongoose.Schema;
const paginate = require('mongoose-paginate');
var ads = new schema(
    {
        url: {
            type: String
        },
        userUrl: {
            type: String
        },
        title: {
            type: String
        },
        userTitle: {
            type: String
        },
        clickTags: {
            type: String
        },
        userClickTags: {
            type: String
        },
        addedBy: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "ADMIN"
        },
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "users"
        },
        inscription: {
            type: Number,
            default: 0
        },
        inscriptionNumber: {
            type: String
        },
        date: {
            type: String
        },
        active: {
            type: Boolean,
        },
        isNext: {
            type: Boolean,
        },
        status: {
            type: String,
            enum: ["ACTIVE", "BLOCK", "DELETE"],
            default: "ACTIVE"
        },
        price: { type: Number, default: 0 },
        info: String
    }, { timestamps: true }
);
ads.plugin(paginate)
module.exports = mongoose.model("ads", ads);


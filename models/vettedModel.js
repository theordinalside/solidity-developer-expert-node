const mongoose = require("mongoose");
const schema = mongoose.Schema;
var vettedModel = new schema(
    {
        tokenId: {
            type: String
        },
        name: {
            type: String
        },
        websiteUrl: {
            type: String
        },
        telegramUrl: {
            type: String
        },
        status: {
            type: String,
            enum: ["ACTIVE", "BLOCK", "DELETE"],
            default: "ACTIVE"
        },
    }, { timestamps: true }
);

module.exports = mongoose.model("vetted", vettedModel);

const mongoose = require("mongoose");
const schema = mongoose.Schema;
var topCoinSchema = new schema(
    {
        address: {
            type: String
        },
        decimals: {
            type: String
        },
        name: {
            type: String
        },
        symbol: {
            type: String
        },
        status: {
            type: String,
            enum: ["ACTIVE", "BLOCK", "DELETE"],
            default: "ACTIVE"
        },
    }, { timestamps: true }
);

module.exports = mongoose.model("topcoin", topCoinSchema);

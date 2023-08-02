const mongoose = require("mongoose");
const schema = mongoose.Schema;
var rightAddSchema = new schema(
    {
        image: {
            type: String
        },
        url: {
            type: String
        },
        status: {
            type: String,
            enum: ["ACTIVE", "BLOCK", "DELETE"],
            default: "ACTIVE"
        },
    }, { timestamps: true }
);

module.exports = mongoose.model("rightadd", rightAddSchema);

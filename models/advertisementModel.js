const mongoose = require("mongoose");
const schema = mongoose.Schema;
var advertisementSchema = new schema(
    {
        image: {
            type: String
        },
        title: {
            type: String
        },
        description: {
            type: String
        },
        addType: {
            type: String,
            enum: ["SMALL", "LARGE"]
        },
        active: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: ["ACTIVE", "BLOCK", "DELETE"],
            default: "ACTIVE"
        },
    }, { timestamps: true }
);

module.exports = mongoose.model("advertisement", advertisementSchema);


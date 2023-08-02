const mongoose = require("mongoose");
const schema = mongoose.Schema;
var setting = new schema(
    {
        type: {
            type: String
        },
        value: {
            type: Number
        },
    }, { timestamps: true }
);

module.exports = mongoose.model("settings", setting);

(async () => {
    let data = await mongoose.model("settings", setting).find();
    if (data.length !== 0) {
        console.log("Default setting already added!")
    }
    else {
        await mongoose.model("settings", setting).insertMany([{
            type: "price",
            value: 0.0001
        }, {
            type: "limit",
            value: 100
        }]);
        console.log("Default setting added successfully.")
    }
})();
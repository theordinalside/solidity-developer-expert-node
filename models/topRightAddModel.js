const mongoose = require("mongoose");
const schema = mongoose.Schema;
var topAddSchema = new schema(
    {
        image: {
            type: String
        },
        url: {
            type: String
        },
        type: {
            type: String,
            enum: ["TOP", "RIGHT"]
        },
        status: {
            type: String,
            enum: ["ACTIVE", "BLOCK", "DELETE"],
            default: "ACTIVE"
        },
    }, { timestamps: true }
);

module.exports = mongoose.model("toprightadd", topAddSchema);

mongoose.model("toprightadd", topAddSchema).find({}, (err, result) => {
    if (err) {
        console.log("Default static topright error", err);
    }
    else if (result.length != 0) {
        console.log("Default static topright");
    }
    else {
        var obj1 = {
            type: "TOP",
            image: "https://res.cloudinary.com/mobiloitte-testing/image/upload/v1607430771/i56tnqvvwpzguxwarfjf.jpg",
            url: "https://foomoobucket.s3.ap-southeast-2.amazonaws.com/fomoo1613218319652.jpg"
        };
        var obj2 = {
            type: "RIGHT",
            image: "https://foomoobucket.s3.ap-southeast-2.amazonaws.com/fomoo1613218319652.jpg",
            url: "https://foomoobucket.s3.ap-southeast-2.amazonaws.com/fomoo1613218319652.jpg"
        };
        mongoose.model("toprightadd", topAddSchema).create(obj1, obj2, (staticErr, staticResult) => {
            if (staticErr) {
                console.log("Static topright error.", staticErr);
            }
            else {
                console.log("Static topright created.", staticResult)
            }
        })
    }
})

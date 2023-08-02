const mongoose = require("mongoose");
const schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");

var contactUs = new schema(
    {
        title: {
            type: String
        },
        type: {
            type: String
        },
        description: {
            type: String
        },
        status: {
            type: String,
            enum: ["ACTIVE", "DELETE", "BLOCK"],
            default: "ACTIVE"
        }
    },
    {
        timestamps: true
    }
);

contactUs.plugin(mongoosePaginate);
module.exports = mongoose.model("contactUs", contactUs);

mongoose.model("contactUs", contactUs).find({}, (err, result) => {
    if (err) {
        console.log("Default static contactUs error", err);
    }
    else if (result.length != 0) {
        console.log("Default static contactUs");
    }
    else {
        var obj1 = {
            type: "EmailRequirement1",
            title: "Email Requirement 1",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget"
        };
        var obj2 = {
            type: "EmailRequirement2",
            title: "Email Requirement 2",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget."
        };
        mongoose.model("contactUs", contactUs).create(obj1, obj2, (staticErr, staticResult) => {
            if (staticErr) {
                console.log("Static contacctUs error.", staticErr);
            }
            else {
                console.log("Static contactUs created.", staticResult)
            }
        })
    }
})
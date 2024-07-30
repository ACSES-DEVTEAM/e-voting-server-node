const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const associationSchema = new Schema({
    name: {
        type: String,
        required: "This field is required.",
    },
    votingStatus: {
        type: Boolean,
        default: false,
    },
    portfolio: {
        type: [String],
        required: "This field is required.",
    },
}, {timestamps: true});

// static signup method
associationSchema.statics.signupAssociation = async function (name, portfolio) {
    if (!name || !portfolio) {
        throw Error("All Fields Are Required!!")
    }

    // check if name exists in Associations
    const associationExists = await this.findOne({ name });
    if (associationExists) {
        throw Error("This name is already taken");
    }
    const association = await this.create({ name, portfolio });
    return association;
};

module.exports = mongoose.model("Associations", associationSchema);

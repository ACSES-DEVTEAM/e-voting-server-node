const mongoose = require('mongoose');

const Schema = mongoose.Schema

const adminSchema = new Schema({

    siteMode: {
        type: String,
        required: 'This field is required.',
        enum: ["Default", "Voting", "Under Maintenance"],
        unique: true,
    },

}, {timestamps: true})


module.exports = mongoose.model('Admin', adminSchema);
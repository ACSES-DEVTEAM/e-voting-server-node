const mongoose = require('mongoose');

const Schema = mongoose.Schema

const adminSchema = new Schema({

    name: {
        type: String,
        required: 'This field is required.',
        unique: true,
    },
    email: {
        type: String,
        required: 'This field is required.',
        unique: true,
    },
    department: {
        type: String,
        required: 'This field is required.',
        enum: ['EL', 'CE', 'MC', 'MA'],
    },
    password: {
        type: String,
        required: 'This field is required.',
    },
    year: {
        type: String,
        required: 'This field is required.',
        enum: ['One','Two','Three','Four'],
    },
    indexNumber: {
        type: String,
        required: 'This field is required.',
        unique: true,
    },

}, {timestamps: true})


module.exports = mongoose.model('Admin', adminSchema);
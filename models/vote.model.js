const mongoose = require('mongoose');

const Schema = mongoose.Schema

const voteSchema = new Schema({
    candiate_indexNumber: {
        type: String,
        required: 'This field is required.',
    },
    voters_id: {
        type: String,
        required: 'This field is required.',
    }
}, {timestamps: true})


module.exports = mongoose.model('Vote', voteSchema);

/*
    We will use the indexNumber to update the candidate's votes
    in the candidate.model
*/
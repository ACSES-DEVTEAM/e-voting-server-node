const mongoose = require('mongoose');
const User = require('./user.model');

const Schema = mongoose.Schema

const candidateSchema = new Schema({
    indexNumber: {
        type: String,
        required: 'This field is required.',
        unique: true,
    },
    position: {
        type: String,
        required: 'This field is required.',
    },
    votes: {
        type: Number,
        default: 0
    },
    photo: {
        type: String,
        required: 'This field is required.',
    },
    bio: {
        type: String,
        required: 'This field is required.',
    },
}, {timestamps: true})


// static signup method
candidateSchema.statics.signup = async function (indexNumber, position, photo, bio) {
    if (!indexNumber || !position || !photo || !bio) {
        throw Error("All Fields Are Required!!")
    }

    // check if indexNumber exists in User
    const user = await User.findOne({ indexNumber });
    if (!user) {
        // return error
        throw Error("Index Number Does Not Exist!!")
    }
    const candidate = await this.create({ indexNumber, position, photo, bio });
    
    // return the User and candidate
    return { user, candidate };

}

module.exports = mongoose.model('Candidate', candidateSchema);


/*
    We will use the indexNumber to fetch for the candidate's information
    in the user.model
*/
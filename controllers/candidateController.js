const Candidate = require('../models/candidate.model');
const User = require('../models/user.model');
const mongoose = require('mongoose')


// Register a new Candidate
const createCandidate = async (req, res) => {

    const { indexNumber, position, photo, bio } = req.body;
    try {
        // check if indexNumber exists in User
        const user = await User.findOne({ indexNumber });
        if (!user) {
            return res.status(404).json({ error: "No such candidate from user" });
        }
        const candidate = await Candidate.create({ indexNumber, position, photo, bio });
        res.status(200).json(candidate);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// get Candidate by indexNumber
const getCandidate = async (req, res) => {

    const { indexNumber } = req.body;

    const candidate = await Candidate.findOne({ indexNumber });
    if (!candidate) {
        return res.status(404).json({ error: "No such candidate from candidate" });
    }

    // getting candidate indexNumber and check if indexNumber exists in User
    const user = await User.findOne({ indexNumber });
    if (!user) {
        return res.status(404).json({ error: "No such candidate from user" });
    }

    // return user and candidate
    res.status(200).json({ user, candidate });
    
}

// get all Candidates
const getCandidates = async (req, res) => {

    const candidates = await Candidate.find({}).sort({ createdAt: -1 });

    // getting indexNumber, position, photo, bio from candidate
    for (let i = 0; i < candidates.length; i++) {
        const user = await User.findOne({ indexNumber: candidates[i].indexNumber });
        if (!user) {
            return res.status(404).json({ error: "No such candidate from user" });
        }
        candidates[i] = { ...candidates[i]._doc, user };
    }

    const sortedCandidates = [];

    // return indexNumber, position, photo, bio, user from candidate
    for (let i = 0; i < candidates.length; i++) {
        const indexNumber = candidates[i].indexNumber;
        const position = candidates[i].position;
        const photo = candidates[i].photo;
        const bio = candidates[i].bio;
        const votes = candidates[i].votes;
        const name = candidates[i].user.name;
        const year = candidates[i].user.year;
        sortedCandidates[i] = { bio, photo, name, position, year, indexNumber, votes };
    }

    res.status(200).json(sortedCandidates); 
}

// delete a Candidate
const deleteCandidate = async (req, res) => {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such candidate" });
    }

    const candidate = await Candidate.findOneAndDelete({ _id: id });
    if (!candidate) {
        return res.status(404).json({ error: "No such candidate" });
    }
    res.status(200).json(candidate);
}

// update a Candidate
const updateCandidate = async (req, res) => {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such candidate" });
    }

    const candidate = await Candidate.findOneAndUpdate({ _id: id }, { ...req.body });
    if (!candidate) {  
        return res.status(404).json({ error: "No such candidate" });
    }

    res.status(200).json(candidate);
}

module.exports = {
    createCandidate,
    getCandidate,
    getCandidates,
    deleteCandidate,
    updateCandidate
}
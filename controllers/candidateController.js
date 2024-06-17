const Candidate = require('../models/candidate.model');
const User = require('../models/user.model');
const mongoose = require('mongoose')


// Register a new Candidate
const createCandidate = async (req, res) => {

    const { indexNumber, position, photo } = req.body;
    try {
        const candidate = await Candidate.create({ indexNumber, position, photo });
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
    res.status(200).json(candidates);
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
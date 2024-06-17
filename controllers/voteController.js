const Vote = require("../models/vote.model");
const mongoose = require("mongoose");
const Candidate = require("../models/candidate.model");

// get all Votes
const getVotes = async (req, res) => {
  // Display all votes
  const votes = await Vote.find({}).sort({ createdAt: -1 });
  res.status(200).json(votes);
};

// Add vote
const addVote = async (req, res) => {
  const { indexNumber } = req.body;

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such user" });
  }

  const candidate = await Candidate.findOne({ indexNumber });

  if (!candidate) {
    return res.status(404).json({ error: "No such candidate from candidate" });
  }

  // check if user has already voted
  const user = await Vote.findOne({ voters_id: id });
  if (user) {
    return res.status(400).json({ error: "User has already voted" });
  }

  // add the id and candidate's indexNumber to vote
  const newVote = new Vote({ voters_id: id, candiate_indexNumber: indexNumber });
  await newVote.save();

  // update candidate's vote with vote from req.body
  const updatedCandidate = await Candidate.findOneAndUpdate(
    { indexNumber },
    { $inc: { votes: 1 } },
    { new: true }
  );
  res.status(200).json(updatedCandidate);
};

// Reset Vote by indexNumber
const resetVote = async (req, res) => {
  const { indexNumber } = req.body;

  const candidate = await Candidate.findOne({ indexNumber });

  if (!candidate) {
    return res.status(404).json({ error: "No such candidate from candidate" });
  }

  // Reset candidate's vote
  const updatedCandidate = await Candidate.findOneAndUpdate(
    { indexNumber },
    { $set: { votes: 0 } },
    { new: true }
  );
  res.status(200).json(updatedCandidate);
};

module.exports = {
  getVotes,
  addVote,
  resetVote,
};

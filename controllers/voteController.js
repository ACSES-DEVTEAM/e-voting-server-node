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
  const { indexNumbers } = req.body; // array of indexNumber of candidates that user voted

  const { id } = req.params; // id of user
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such user" });
  }

  const candidates = await Candidate.find({
    indexNumber: { $in: indexNumbers },
  });

  if (candidates.length !== indexNumbers.length) {
    return res.status(404).json({ error: "No such candidate from candidate" });
  }

  // check if user has already voted
  const vote = await Vote.findOne({ voters_id: id });
  if (vote) {
    return res.status(400).json({ error: "User has already voted" });
  }

  // add the id and candidate's indexNumber to vote
  const newVotes = {
    voters_id: id,
    candiate_indexNumber: indexNumbers,
  };
  await Vote.create(newVotes);

  // update candidate's vote with vote from req.body
  const updatedCandidates = await Candidate.updateMany(
    { indexNumber: { $in: indexNumbers } },
    { $inc: { votes: 1 } },
    { new: true }
  );
  res.status(200).json(updatedCandidates);
};

// Reset Vote by indexNumber
const resetVote = async (req, res) => {
  const { indexNumber } = req.body; // array of indexNumber of candidates that user reset vote

  const candidate = await Candidate.findOne({ indexNumber });

  if (!candidate) {
    return res.status(404).json({ error: "No such candidate from candidate" });
  }

  // Reset candidate's vote
  const updatedCandidate = await Candidate.updateMany(
    { indexNumber: { $in: indexNumber } },
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

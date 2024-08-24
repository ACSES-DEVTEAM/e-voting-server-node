const Vote = require("../models/vote.model");
const mongoose = require("mongoose");
const Candidate = require("../models/candidate.model");
const User = require("../models/user.model");

// get all Votes
const getVotes = async (req, res) => {
  // Display all votes
  const votes = await Vote.find({}).sort({ createdAt: -1 });
  res.status(200).json(votes);
};

// Add vote
const addVote = async (req, res) => {
  let { indexNumbers } = req.body; // array of indexNumber of candidates that user voted
  // if (indexNumbers.includes("")) {
  //   indexNumbers.splice(indexNumbers.indexOf(""), 1);
  // }
  indexNumbers = indexNumbers.filter(indexNumber => indexNumber !== "");

  const { id } = req.params; // id of user
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such user" });
  }

  const candidates = await Candidate.find({
    indexNumber: { $in: indexNumbers },
  });

  // if (candidates.length !== indexNumbers.length) {
  //   return res.status(404).json({ error: "No such candidate from candidate" });
  // }

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
  await Candidate.updateMany(
    { indexNumber: { $in: indexNumbers } },
    { $inc: { votes: 1 } },
    { new: true }
  );

  // update user's isVoted property to true
  await User.updateOne({ _id: id }, { $set: { isVoted: true } });

  res.status(200).json({ message: "Vote submitted successfully" });
  // res.status(200).json(updatedCandidates);
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

// get the sum of all "candiate_indexNumber" from Votes
const getTotalVotes = async (req, res) => {
  const votes = await Vote.find({});
  const totalVotes = votes.reduce((sum, vote) => sum + vote.candiate_indexNumber.length, 0);
  res.status(200).json(totalVotes);
};


// Set isVoted to false and remove the votes from the candidate
const removeVote = async (req, res) => {
  const { indexNumber } = req.body; // user indexNumber
  const user = await User.findOne({ indexNumber });
  if (!user) {
    return res.status(404).json({ error: "No such user from user" });
  }

  const _id = user._id;
  await User.updateOne({ _id }, { $set: { isVoted: false } });

  const votes = await Vote.findOne({ voters_id: _id });
  const candidate_indexNumber = votes.candiate_indexNumber;
  for (let i = 0; i < candidate_indexNumber.length; i++) {
    await Candidate.updateOne(
      { indexNumber: candidate_indexNumber[i] },
      { $inc: { votes: -1 } },
      { new: true }
    );
  }
  await Vote.findOneAndDelete({ voters_id: _id });
  res.status(200).json({ message: "Vote removed successfully" });
};

// get all users who have voted
const getUsersWhoHaveVoted = async (req, res) => {
  const users = await User.find({ isVoted: true });

  const usersWhoHaveVoted = users.map((user) => ({
    name: user.name,
    indexNumber: user.indexNumber,
    department: user.department,
    year: user.year,
  }));
  
  const totalYear1 = usersWhoHaveVoted.filter((user) => user.year === "1").length;
  const totalYear2 = usersWhoHaveVoted.filter((user) => user.year === "2").length;
  const totalYear3 = usersWhoHaveVoted.filter((user) => user.year === "3").length;
  const totalYear4 = usersWhoHaveVoted.filter((user) => user.year === "4").length;
  const totalUsersWhoHaveVoted = totalYear1 + totalYear2 + totalYear3 + totalYear4;

  res.status(200).json({
    usersWhoHaveVoted,
    totalYear1,
    totalYear2,
    totalYear3,
    totalYear4,
    totalUsersWhoHaveVoted,
  });
};

// get all users who have not voted
const getUsersWhoHaveNotVoted = async (req, res) => {
  const users = await User.find({ isVoted: false });

  const usersWhoHaveNotVoted = users.map((user) => ({
    name: user.name,
    indexNumber: user.indexNumber,
    department: user.department,
    year: user.year,
  }));
  
  const totalYear1 = usersWhoHaveNotVoted.filter((user) => user.year === "1").length;
  const totalYear2 = usersWhoHaveNotVoted.filter((user) => user.year === "2").length;
  const totalYear3 = usersWhoHaveNotVoted.filter((user) => user.year === "3").length;
  const totalYear4 = usersWhoHaveNotVoted.filter((user) => user.year === "4").length;
  const totalUsersWhoHaveNotVoted = totalYear1 + totalYear2 + totalYear3 + totalYear4;

  res.status(200).json({
    usersWhoHaveNotVoted,
    totalYear1,
    totalYear2,
    totalYear3,
    totalYear4,
    totalUsersWhoHaveNotVoted,
  });
};

// get all users who have voted by a department
const getUsersWhoHaveVotedByDepartment = async (req, res) => {
  const { department } = req.params;
  const users = await User.find({ department, isVoted: true });
  const usersWhoHaveVoted = users.map((user) => ({
    name: user.name,
    indexNumber: user.indexNumber,
    department: user.department,
    year: user.year,
  }));
  const totalYear1 = usersWhoHaveVoted.filter((user) => user.year === "1").length;
  const totalYear2 = usersWhoHaveVoted.filter((user) => user.year === "2").length;
  const totalYear3 = usersWhoHaveVoted.filter((user) => user.year === "3").length;
  const totalYear4 = usersWhoHaveVoted.filter((user) => user.year === "4").length;
  const totalUsersWhoHaveVoted = totalYear1 + totalYear2 + totalYear3 + totalYear4;

  res.status(200).json({
    usersWhoHaveVoted,
    totalYear1,
    totalYear2,
    totalYear3,
    totalYear4,
    totalUsersWhoHaveVoted,
  });
};

// get all users who have not voted by a department
const getUsersWhoHaveNotVotedByDepartment = async (req, res) => {
  const { department } = req.params;
  const users = await User.find({ department, isVoted: false });
  const usersWhoHaveNotVoted = users.map((user) => ({
    name: user.name,
    indexNumber: user.indexNumber,
    department: user.department,
    year: user.year,
  }));
  const totalYear1 = usersWhoHaveNotVoted.filter((user) => user.year === "1").length;
  const totalYear2 = usersWhoHaveNotVoted.filter((user) => user.year === "2").length;
  const totalYear3 = usersWhoHaveNotVoted.filter((user) => user.year === "3").length;
  const totalYear4 = usersWhoHaveNotVoted.filter((user) => user.year === "4").length;
  const totalUsersWhoHaveNotVoted = totalYear1 + totalYear2 + totalYear3 + totalYear4;

  res.status(200).json({
    usersWhoHaveNotVoted,
    totalYear1,
    totalYear2,
    totalYear3,
    totalYear4,
    totalUsersWhoHaveNotVoted,
  });
};

module.exports = {
  getVotes,
  addVote,
  resetVote,
  getTotalVotes,
  removeVote,
  getUsersWhoHaveVoted,
  getUsersWhoHaveNotVoted,
  getUsersWhoHaveVotedByDepartment,
  getUsersWhoHaveNotVotedByDepartment,
};

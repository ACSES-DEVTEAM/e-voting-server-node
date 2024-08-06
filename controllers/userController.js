const User = require("../models/user.model");
const Candidates = require("../models/candidate.model");
const Votes = require("../models/vote.model");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Student = require("../models/student.model");
const Associations = require("../models/associations.model");

// create token
const createtoken = (_id) => {
  try {
    // Create and sign the JWT
    const token = jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1w" });
    return token;
  } catch (error) {
    // Handle any errors that occur during token creation
    console.error("Error creating JWT:", error);
    return null; // You may choose to return null or throw an error here
  }
};

// login a User
const login_user = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    // const name = user.name;
    // const lastLogin = user.lastLogin;

    // Creating token
    const token = createtoken(user._id);

    //res.status(200).json({ name, email, lastLogin, token });
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// create a new User
const signup_user = async (req, res) => {
  const { name, email, password, department, year, indexNumber } = req.body;
  try {
    const user = await User.signup(
      name,
      email,
      password,
      department,
      year,
      indexNumber
    );

    // Creating token
    const token = createtoken(user._id);

    //res.status(200).json({ username, email, lastLogin, token })
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get User by id
const getUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such user" });
  }
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ error: "No such user" });
  }
  res.status(200).json(user);
};

// get all Users
const getUsers = async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 });
  res.status(200).json(users);
};

// delete a User
const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such user" });
  }
  const user = await User.findOneAndDelete({ _id: id });
  if (!user) {
    return res.status(404).json({ error: "No such user" });
  }
  res.status(200).json(user);
};

// update a User
const updateUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such user" });
  }
  const user = await User.findOneAndUpdate({ _id: id }, { ...req.body });
  if (!user) {
    return res.status(404).json({ error: "No such user" });
  }
  res.status(200).json(user);
};

// get the sum of all users from various departments in the user collection and return them in an array eg:[{department: "acses", count: 10}, {department: "mesa", count: 5}]
const getSumOfUsersFromDepartments = async (req, res) => {
  const users = await User.aggregate([
    {
      $group: {
        _id: "$department",
        count: { $sum: 1 },
      },
    },
  ]);
  res.status(200).json(users);
};

// get all Users and Candidates and Votes
const getAllUsersFullInfo = async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 });
  const candidates = await Candidates.find({}).sort({ createdAt: -1 });
  const votes = await Votes.find({}).sort({ createdAt: -1 });
  res.status(200).json({ users, candidates, votes });
};

// update a User by indexNumber
const updateUserByIndexNumber = async (req, res) => {
  const { indexNumber } = req.body;
  // check if indexNumber exists in User then update
  const userExists = await User.findOne({ indexNumber });
  if (!userExists) {
    return res.status(404).json({ error: "No such user" });
  }
  // update the user using findOneAndUpdate
  const user = await User.findOneAndUpdate(
    { indexNumber },
    { $set: { ...req.body } },
    { new: true, runValidators: true }
  );
  res.status(200).json(user);
};

// Accept object from body and insert many into Student collection
const addStudents = async (req, res) => {
  try {
    const results = req.body;
    let response = [];
    const associationName = results[1];

    const associationExists = await Associations.findOne({ name: associationName });
    if (!associationExists) {
      return res.status(404).json({ error: "No such association. Add association first. - " + associationName });
    }

    for (const student of results[0]) {
      const result = await Student.addStudent(
        student.name,
        student.indexNumber,
        associationName,
        student.year,
        student.contact
      );
      response.push(result);
    }
    res.status(200).json({ message: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// updateVotingCode
const updateVotingCode = async (req, res) => {
  const response = await Student.updateVotingCode();
  res.status(200).json({ message: response });
};

// sendAssociationCodes
const sendAssociationCodes = async (req, res) => {
  const association = req.body;
  const response = await Student.sendAssociationCodes(association);
  console.log("User ID: ", association);
  console.log("Response: ", response);  
  res.status(200).json({ message: response });
};

module.exports = {
  login_user,
  signup_user,
  getUser,
  getUsers,
  deleteUser,
  updateUser,
  getSumOfUsersFromDepartments,
  getAllUsersFullInfo,
  updateUserByIndexNumber,
  addStudents,
  updateVotingCode,
  sendAssociationCodes,
};

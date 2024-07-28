const User = require("../models/user.model");
const Candidates = require("../models/candidate.model");
const Votes = require("../models/vote.model");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

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

  const {name, email, password, department, year, indexNumber} = req.body
    try {
        const user = await User.signup(name, email, password, department, year, indexNumber)

        // Creating token
        const token = createtoken(user._id)
        
        //res.status(200).json({ username, email, lastLogin, token })
        res.status(200).json({ user, token })

    } catch (error) {
        res.status(400).json({error: error.message})
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
}

// get all Users and Candidates and Votes
const getAllUsersFullInfo = async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 });
  const candidates = await Candidates.find({}).sort({ createdAt: -1 });
  const votes = await Votes.find({}).sort({ createdAt: -1 });
  res.status(200).json({ users, candidates, votes });
  
}

module.exports = {
  login_user,
  signup_user,
  getUser,
  getUsers,
  deleteUser,
  updateUser,
  getSumOfUsersFromDepartments,
  getAllUsersFullInfo
};

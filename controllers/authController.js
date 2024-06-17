const User = require("../models/user.model");
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
const login = async (req, res) => {};

// create a new User
const signup = async (req, res) => {};

module.exports = {
  login,
  signup,
};

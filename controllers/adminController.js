const Admin = require("../models/admin.model");
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

// login a Admin
const login_admin = async (req, res) => {};

// create a new Admin
const signup_admin = async (req, res) => {};

// get Admin by id
const getAdmin = async (req, res) => {};

// get all Admins
const getAdmins = async (req, res) => {};

// delete a Admin
const deleteAdmin = async (req, res) => {};

// update a Admin
const updateAdmin = async (req, res) => {};

module.exports = {
  login_admin,
  signup_admin,
  getAdmin,
  getAdmins,
  deleteAdmin,
  updateAdmin,
};

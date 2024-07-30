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

// update siteMode
const updateSiteMode = async (req, res) => {
  const { siteMode } = req.body;
  try {
    const admin = await Admin.findOneAndUpdate(
      { siteMode: { $ne: siteMode } }, // Don't update if the siteMode is unchanged
      { siteMode },
      { new: true, runValidators: true }
    );
    if (!admin) {
      return res.status(404).json({ error: "No such admin" });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get the siteMode
const getSiteMode = async (req, res) => {
  try {
    const admin = await Admin.findOne();
    if (!admin) {
      return res.status(404).json({ error: "No such admin" });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  updateSiteMode,
  getSiteMode,
};

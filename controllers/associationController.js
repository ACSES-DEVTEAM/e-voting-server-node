const Associations = require("../models/associations.model");
const Student = require("../models/student.model");

// get all associations
const getAllAssociations = async (req, res) => {
  try {
    const associations = await Associations.find();
    res.status(200).json(associations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Signup an association
const signupAssociation = async (req, res) => {
  const { name, portfolio } = req.body;
  try {
    const association = await Associations.signupAssociation(name, portfolio);
    res.status(200).json(association);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an association
const updateAssociation = async (req, res) => {
  const { name } = req.body;
  // use put method to update
  try {
    // check if name exists in Associations then update
    const associationExists = await Associations.findOne({ name });
    if (!associationExists) {
      return res.status(404).json({ error: "No such association" });
    }
    // update the association using findOneAndUpdate
    const association = await Associations.findOneAndUpdate(
      { name },
      { $set: { ...req.body } },
      { new: true, runValidators: true }
    );
    res.status(200).json(association);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get an association by name
const getAssociationByName = async (req, res) => {
  const { name } = req.body;
  try {
    const association = await Associations.findOne({ name });
    if (!association) {
      return res.status(404).json({ error: "No such association  " + name });
    }
    res.status(200).json(association);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an association
const deleteAssociation = async (req, res) => {
  const { name } = req.body;
  try {
    const association = await Associations.findOneAndDelete({ name });
    const students = await Student.find({}).sort({ createdAt: -1 });
    let noAssociation = [];
    let someAssociation = [];
    students.forEach((dept) => {
      if (dept.department.includes(name)) {
        const index = dept.department.indexOf(name);
        if (index > -1) {
          dept.department.splice(index, 1);
          if (dept.department.length === 0) {
            noAssociation.push(dept.indexNumber);
          } else {
            someAssociation.push(dept.indexNumber);
          }
        }
      }
    });
    if (!association) {
      return res.status(404).json({ error: "No such association" });
    }

    for (let i = 0; i < noAssociation.length; i++) {
      const student = await Student.findOneAndDelete({
        indexNumber: noAssociation[i],
      });
    }

    for (let i = 0; i < someAssociation.length; i++) {
      const student = await Student.findOneAndUpdate(
        { indexNumber: someAssociation[i] },
        { $pull: { department: name } },
        { $set: { department: { $each: [] } } },
        { new: true, runValidators: true }
      );
    }

    res.status(200).json(association);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllAssociations,
  signupAssociation,
  updateAssociation,
  getAssociationByName,
  deleteAssociation,
};

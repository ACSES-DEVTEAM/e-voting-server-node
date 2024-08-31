/**
 * The mongoose module provides a straight-forward, schema-based solution
 * to model your application data. It includes built-in type casting, validation,
 * query building, business logic hooks and more.
 */
const mongoose = require("mongoose");

/**
 * Bcrypt is a password hashing function that is intentionally slow.
 * This means that it is not suitable for high-performance applications
 * (e.g., server-side web apps) with a lot of traffic.
 */
const bcrypt = require("bcrypt");

/**
 * Validator is a library of string validators and sanitizers.
 * It helps you validate and sanitize data, removing unwanted characters
 * and providing a good starting point when building out the validations
 * for your data.
 */
const validator = require("validator");

/**
 * Axios is a promise-based HTTP client for the browser and node.js.
 * It is a rewrite of the $http service in AngularJS.
 */
const axios = require("axios");

const EmailServices = require("../models/emailServices")

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: "This field is required.",
    },
    indexNumber: {
      type: String,
      required: "This field is required.",
    },
    department: {
      type: [String],
      required: "This field is required.",
    },
    year: {
      type: String,
      required: "This field is required.",
      enum: ["1", "2", "3", "4"],
    },
    isVoted: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isAuditor: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    votingCode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

/**
 * Static method to sign up a new user
 * @param {string} name - The name of the user
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @param {string} department - The department of the user
 * @param {string} year - The year of the user
 * @param {string} indexNumber - The index number of the user
 * @throws {Error} Throws an error if any of the required fields are missing
 * or if the name, email, password, department, or year are invalid
 * @returns {object} Returns an object containing the details of the newly created user
 */
userSchema.statics.signup = async function (
  name,
  email,
  password,
  department,
  year,
  indexNumber
) {
  if (!name || !email || !password || !department || !year || !indexNumber) {
    throw Error("All Fields Are Required!!");
  }

  if (name.length < 5) {
    throw Error("Name Should Be More Than 5 Characters Long!!");
  }

  if (!validator.isEmail(email)) {
    throw Error("Invalid Email, Enter Correct Email");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error("Password Is Not Strong");
  }

  const userNameExists = await this.findOne({ name });
  if (userNameExists) {
    throw Error("This username is already taken");
  }

  const emailExists = await this.findOne({ email });
  if (emailExists) {
    throw Error("This email is already in use");
  }

  const indexNumberExists = await this.findOne({ indexNumber });
  if (indexNumberExists) {
    throw Error("This index number is already registered");
  }

  if (
    department !== "acses" &&
    department !== "eleesa" &&
    department !== "adges" &&
    department !== "mesa" &&
    department !== "gesa"
  ) {
    if (
      department !== "acses" &&
      department !== "eleesa" &&
      department !== "adges" &&
      department !== "mesa" &&
      department !== "gesa"
    ) {
      throw Error("Invalid Department");
    }

    if (year !== "1" && year !== "2" && year !== "3" && year !== "4") {
      if (year !== "1" && year !== "2" && year !== "3" && year !== "4") {
        throw Error("Invalid Year");
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const date = new Date();
      let dateDay = date.getDate();
      let dateMonth = date.getMonth();
      let dateYear = date.getFullYear();
      let currentDate = `${dateDay}/${dateMonth}/${dateYear}`;

      const user = await this.create({
        name,
        email,
        password: hash,
        department,
        year,
        indexNumber,
        lastLogin: currentDate,
        isVoted: false,
        isAdmin: false,
        isAuditor: false,
      });

      return {
        name: user.name,
        email: user.email,
        department: user.department,
        year: user.year,
        indexNumber: user.indexNumber,
        lastLogin: user.lastLogin,
        isVoted: user.isVoted,
        isAdmin: user.isAdmin,
        isAuditor: user.isAuditor,
        _id: user._id,
      };
    }
  }
};

/**
 * Asynchronous function that logs in a user using their email and password.
 * 
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @throws {Error} Throws an error if any of the parameters are missing.
 * @throws {Error} Throws an error if the user is not found.
 * @throws {Error} Throws an error if the password does not match.
 * @returns {Object} - An object containing the user's name, email, department, year, index number, last login date, voting status, admin status, and auditor status.
 */
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All Fields Are Required!!");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Incorrect Email");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect Password");
  }

  const date = new Date();
  let dateDay = date.getDate();
  let dateMonth = date.getMonth() + 1;
  let dateYear = date.getFullYear();
  let currentDate = `${dateDay}/${dateMonth}/${dateYear}`;

  const update = { lastLogin: currentDate };

  const doc = await this.findOneAndUpdate(user, update, {
    returnOriginal: false,
  });

  return {
    name: doc.name,
    email: doc.email,
    department: doc.department,
    year: doc.year,
    indexNumber: doc.indexNumber,
    lastLogin: doc.lastLogin,
    isVoted: doc.isVoted,
    isAdmin: doc.isAdmin,
    isAuditor: doc.isAuditor,
    _id: doc._id,
  };
};

/**
 * Static method to login a user using their index number, password, and department.
 * @param {string} indexNumber - The index number of the user.
 * @param {string} password - The voting code of the user.
 * @param {string} department - The department of the user.
 * @throws {Error} Throws an error if any of the parameters are missing.
 * @throws {Error} Throws an error if the user is not found.
 * @throws {Error} Throws an error if the password does not match.
 * @throws {Error} Throws an error if the department does not exist.
 * @returns {Object} - An object containing the user's name, department, year, index number, last login date, voting status, admin status, and auditor status.
 */
userSchema.statics.loginIndexNumber = async function (
  indexNumber,
  password,
  department
) {
  // Check if all fields are provided
  if (!indexNumber || !password || !department) {
    throw Error("All Fields Are Required!!");
  }

  // Find the user by index number
  const user = await this.findOne({ indexNumber });
  if (!user) {
    throw Error("Incorrect Index Number");
  }

  // Find the user by voting code
  // const match = await bcrypt.compare(password, user.password);
  const passwordMatch = await this.findOne({ votingCode: password });
  if (!passwordMatch) {
    throw Error("Incorrect Password");
  }

  // Check if the department exists
  const students = await this.find({}).sort({ createdAt: -1 });

  students.forEach((dept) => {
    if (!dept.department.includes(department)) {
      throw Error("Department does not exist");
    }
  });

  // Check if the department is valid
  const departments = ["acses", "gesa", "adges", "mesa", "eleesa"];

  if (!departments.includes(department)) {
    throw new Error("Department does not exist");
  }

  // Update the last login date
  const date = new Date();
  let dateDay = date.getDate();
  let dateMonth = date.getMonth() + 1;
  let dateYear = date.getFullYear();
  let currentDate = `${dateDay}/${dateMonth}/${dateYear}`;

  const update = { lastLogin: currentDate };

  const doc = await this.findOneAndUpdate(user, update, {
    returnOriginal: false,
  });

  // Return the user's information
  return {
    name: doc.name,
    department: department,
    year: doc.year,
    indexNumber: doc.indexNumber,
    lastLogin: doc.lastLogin,
    isVoted: doc.isVoted,
    isAdmin: doc.isAdmin,
    isAuditor: doc.isAuditor,
    _id: doc._id,
  };
};

/**
 * Adds a new student to the database.
 *
 * @param {string} name - The name of the student.
 * @param {string} indexNumber - The index number of the student.
 * @param {string} department - The department of the student.
 * @param {string} year - The year of study of the student.
 * @param {string} contact - The contact number of the student.
 * @returns {Object} An object containing any errors or the newly created student.
 */
userSchema.statics.addStudent = async function (
  name,
  indexNumber,
  department,
  year,
  contact,
  email
) {
  let errors = [];
  let bIndexNumber = false;
  let bAssociation = false;

  if (!name) {
    errors.push("Please enter the name");
  }

  if (!indexNumber) {
    errors.push("Please enter the index number");
  }

  if (!department) {
    errors.push("Please enter the department");
  }

  if (!year) {
    errors.push("Please enter the year of study");
  }

  if (!contact) {
    errors.push("Please enter the contact number");
  }

  if (!email) {
    errors.push("Please enter the email");
  }

  const student = await this.findOne({ indexNumber });
  if (student) {
    bIndexNumber = true;
    let shouldSave = true;
    errors.push("Student already exists - " + indexNumber);
    student.department.forEach((element) => {
      if (element === department) {
        bAssociation = true;
        shouldSave = false;
        errors.push(
          "Student already exists - " + indexNumber + " in " + department
        );
      }
    });
    if (shouldSave) {
      student.department.push(department);
      await this.updateVotingCode();
      await student.save();
    }
  }

  const studentContactExists = await this.findOne({ contact });
  if (studentContactExists) {
    // throw Error("This contact is already taken");
    errors.push("This contact for " + indexNumber + " is already taken");
  }

  const studentEmailExists = await this.findOne({ email });
  if (studentEmailExists) {
    errors.push("This email for " + indexNumber + " is already taken");
  }

  const date = new Date();
  let dateDay = date.getDate();
  let dateMonth = date.getMonth();
  let dateYear = date.getFullYear();
  let currentDate = `${dateDay}/${dateMonth}/${dateYear}`;

  const code = Math.floor(100000 + Math.random() * 900000);

  const newStudentData = new this({
    name,
    indexNumber,
    department,
    year,
    isVoted: false,
    isAdmin: false,
    isAuditor: false,
    lastLogin: currentDate,
    contact,
    email,
    votingCode: code.toString(),
  });

  if (errors.length > 0) {
    return { errors };
  }

  const newStudent = await this.create(newStudentData);
  return { newStudent };
};

/**
 * Updates the voting codes for all students in the database.
 * 
 * @returns {Promise<Array>} An array of updated student objects.
 */
userSchema.statics.updateVotingCode = async function () {
  const students = await this.find({});
  for (const student of students) {
    const code = Math.floor(100000 + Math.random() * 900000);
    student.votingCode = code.toString();
    await student.save();
  }
  return students;
};

/**
 * Sends association codes to students of a specified association.
 *
 * @param {Object} associationName - The name of the association.
 * @param {string} associationName.association - The name of the association.
 * @return {Object} An object containing the sender, message, and recipients.
 */
userSchema.statics.sendAssociationCodes = async function (associationName) {
  const students = await this.find({}).sort({ createdAt: -1 });
  const assNameInput = associationName.association;
  let responseMessages = [];

  students.forEach(async function (dept) {
    if (dept.department.includes(assNameInput)) {
      const response = await EmailServices.sendEmail(
        dept.email,
        assNameInput.toUpperCase(),
        dept.name,
        assNameInput.toUpperCase() + " Voting",
        "Hello, " + dept.name + ". " + dept.votingCode + " is your voting code for the election. Visit 'https://acses-e-voting-frontend.vercel.app/' to vote. Thank You." 
      );
      responseMessages.push(response);
    }
  });
  
  return responseMessages;
};

module.exports = mongoose.model("User", userSchema);

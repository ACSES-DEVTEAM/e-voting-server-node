const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: "This field is required.",
    },
    email: {
      type: String,
      required: "This field is required.",
    },
    department: {
      type: String,
      required: "This field is required.",
      enum: ["acses", "eleesa", "adges", "mesa", "gesa"],
    },
    password: {
      type: String,
      required: "This field is required.",
    },
    year: {
      type: String,
      required: "This field is required.",
      enum: ["1", "2", "3", "4"],
    },
    indexNumber: {
      type: String,
      required: "This field is required.",
    },
    lastLogin: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// static signup method
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

  if (department !== "acses" && department !== "eleesa" && department !== "adges" && department !== "mesa" && department !== "gesa") {
    throw Error("Invalid Department");
  }

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
  });

  return {
    name: user.name,
    email: user.email,
    department: user.department,
    year: user.year,
    indexNumber: user.indexNumber,
    lastLogin: user.lastLogin,
    _id: user._id,
  }
};

// static login method
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
    _id: doc._id,
  };
};

module.exports = mongoose.model("User", userSchema);

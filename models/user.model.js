const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  // {
  //   name: {
  //     type: String,
  //     required: "This field is required.",
  //   },
  //   email: {
  //     type: String,
  //     required: "This field is required.",
  //   },
  //   department: {
  //     type: String,
  //     required: "This field is required.",
  //     enum: ["acses", "eleesa", "adges", "mesa", "gesa"],
  //   },
  //   password: {
  //     type: String,
  //     required: "This field is required.",
  //   },
  //   year: {
  //     type: String,
  //     required: "This field is required.",
  //     enum: ["1", "2", "3", "4"],
  //   },
  //   indexNumber: {
  //     type: String,
  //     required: "This field is required.",
  //   },
  //   lastLogin: {
  //     type: String,
  //     required: true,
  //   },
  //   isVoted: {
  //     type: Boolean,
  //     default: false,
  //   },
  //   isAdmin: {
  //     type: Boolean,
  //     default: false,
  //   },
  //   isAuditor: {
  //     type: Boolean,
  //     default: false,
  //   },
  // },
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
    votingCode: {
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
    isVoted: doc.isVoted,
    isAdmin: doc.isAdmin,
    isAuditor: doc.isAuditor,
    _id: doc._id,
  };
};

// static login method with IndexNumber
userSchema.statics.loginIndexNumber = async function (indexNumber, password, department) {
  if (!indexNumber || !password || !department) {
    throw Error("All Fields Are Required!!");
  }

  const user = await this.findOne({ indexNumber });
  if (!user) {
    throw Error("Incorrect Index Number");
  }
  
  // const match = await bcrypt.compare(password, user.password);
  const passwordMatch = await this.findOne({ votingCode: password });
  if (!passwordMatch) {
    throw Error("Incorrect Password");
  }

  
  const students = await this.find({}).sort({ createdAt: -1 });

  students.forEach((dept) => {
    if (!dept.department.includes(department)) {
      throw Error("Department does not exist");      
    }
  });


  const departments = [
    "acses",
    "gesa",
    "adges",
    "mesa",
    "eleesa",
  ];

  if (!departments.includes(department)) {
    throw new Error("Department does not exist");
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

  // return {
  //   name: doc.name,
  //   email: doc.email,
  //   department: doc.department,
  //   year: doc.year,
  //   indexNumber: doc.indexNumber,
  //   lastLogin: doc.lastLogin,
  //   isVoted: doc.isVoted,
  //   isAdmin: doc.isAdmin,
  //   isAuditor: doc.isAuditor,
  //   _id: doc._id,
  // };
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

// static function to add a new student
userSchema.statics.addStudent = async function (
  name,
  indexNumber,
  department,
  year,
  contact,
) {

  let errors = [];
  let bIndexNumber = false;
  let bAssociation = false;

  if (
    !name ||
    !indexNumber ||
    !department ||
    !year ||
    !contact
  ) {
    errors.push("Please fill in all fields");
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
        errors.push("Student already exists - " + indexNumber + " in " + department);
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
    votingCode: code.toString(),
  });

  if (errors.length > 0) {
    return { errors };
  }

  const newStudent = await this.create(newStudentData);
  return { newStudent };
};

// static function to update all students votingCode
userSchema.statics.updateVotingCode = async function () {
  const students = await this.find({});
  for (const student of students) {
    const code = Math.floor(100000 + Math.random() * 900000);
    student.votingCode = code.toString();
    await student.save();
  }
  return students;
};

// static function that returns all students
userSchema.statics.sendAssociationCodes = async function (associationName) {
  const students = await this.find({}).sort({ createdAt: -1 });
  const assNameInput = associationName.association;
  let studentName = [];
  let studentIndexNumber = [];
  let studentDepartment = [];
  let studentContact = [];
  let studentVotingCode = [];
  let recipients = [];

  students.forEach((dept) => {
    if (dept.department.includes(assNameInput)) {
      studentName.push(dept.name);
      studentIndexNumber.push(dept.indexNumber);
      studentDepartment.push(dept.department);
      studentContact.push(dept.contact);
      studentVotingCode.push(dept.votingCode);
    }
  });

  const data = {
    name: studentName,
    indexNumber: studentIndexNumber,
    department: studentDepartment,
    contact: studentContact,
    votingCode: studentVotingCode,
    client: associationName,
  };

  data.contact.forEach((contact,index) => {
    const contactInfo = contact + ' = ["name" = "' + data.name[index] + ', "code" = "' + data.votingCode[index] + '"]'  
    recipients.push(contactInfo)
  });

  const smsAPIMessage = {"sender": assNameInput,
    "message": "Hello <%name%>, <%code%> is your voting code for the election. Keep it safe.",
    recipients
    };

  return smsAPIMessage;
};

module.exports = mongoose.model("User", userSchema);

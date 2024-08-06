const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StudentsSchema = new Schema(
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

// static function to add a new student
StudentsSchema.statics.addStudent = async function (
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
StudentsSchema.statics.updateVotingCode = async function () {
  const students = await this.find({});
  for (const student of students) {
    const code = Math.floor(100000 + Math.random() * 900000);
    student.votingCode = code.toString();
    await student.save();
  }
  return students;
};

// static function that returns all students
StudentsSchema.statics.sendAssociationCodes = async function (associationName) {
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

module.exports = mongoose.model("Student", StudentsSchema);

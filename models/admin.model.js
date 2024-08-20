const mongoose = require("mongoose");
const User = require("./user.model");

const Schema = mongoose.Schema;

const adminSchema = new Schema(
  {
    siteMode: {
      type: String,
      required: "This field is required.",
      enum: ["Default", "Voting", "Under Maintenance"],
      unique: true,
    },

    password: {
      type: String,
      required: "This field is required.",
    },
  },
  { timestamps: true }
);

// static login function
adminSchema.statics.login = async function (indexNumber, password) {
  // For normal admin
  if (indexNumber && !password) {
    const user = await User.findOne({ indexNumber });

    if (!user) {
      throw new Error("No such user");
    }

    if (user.isAdmin === false) {
      throw new Error("Not an admin");
    }

    return {
      name: user.name,
      department: user.department,
      year: user.year,
      indexNumber: user.indexNumber,
      lastLogin: user.lastLogin,
      isVoted: user.isVoted,
      isAdmin: user.isAdmin,
      isAuditor: user.isAuditor,
      _id: user._id,
      message: "Normal Admin",
    };
  }

  // For super admin
  if (!indexNumber && password) { 
    const admin = await this.findOne({ password });

    if (admin.password !== password) {
      throw new Error('Only Super Admin can login');
    }

    return {
      message: "Super Admin Logged In",
    };
  }


  // For super admin
  if (indexNumber && password) {
    const user = await User.findOne({ indexNumber });

    if (!user) {
      throw new Error("No such user");
    }

    if (user.isAdmin === false) {
      throw new Error("Not an admin");
    }
    

    const admin = await this.findOne({ password });

    if (admin.password !== password) {
      // throw new Error('Incorrect password');
      return {
        name: user.name,
        department: user.department,
        year: user.year,
        indexNumber: user.indexNumber,
        lastLogin: user.lastLogin,
        isVoted: user.isVoted,
        isAdmin: user.isAdmin,
        isAuditor: user.isAuditor,
        _id: user._id,
        message: "Normal Admin",
      };
    }

    return {
      name: user.name,
      department: user.department,
      year: user.year,
      indexNumber: user.indexNumber,
      lastLogin: user.lastLogin,
      isVoted: user.isVoted,
      isAdmin: user.isAdmin,
      isAuditor: user.isAuditor,
      _id: user._id,
      message: "Super Admin",
    };
  }
};

module.exports = mongoose.model("Admin", adminSchema);

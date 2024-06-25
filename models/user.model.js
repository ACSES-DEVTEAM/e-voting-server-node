const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema

const userSchema = new Schema({

    name: {
        type: String,
        required: 'This field is required.',
        unique: true,
    },
    email: {
        type: String,
        required: 'This field is required.',
        unique: true,
    },
    department: {
        type: String,
        required: 'This field is required.',
        enum: ['ACSES', 'ELEESA', 'ADGES', 'MESA', 'GESA'],
    },
    password: {
        type: String,
        required: 'This field is required.',
    },
    year: {
        type: String,
        required: 'This field is required.',
        enum: ['One','Two','Three','Four'],
    },
    indexNumber: {
        type: String,
        required: 'This field is required.',
        unique: true,
    },
    lastLogin: {
        type: String,
        required: true
    }, 

}, {timestamps: true})

// static signup method
userSchema.statics.signup = async function (name, email, password, department, year, indexNumber) {

    if (!name || !email || !password || !department || !year || !indexNumber) {
        throw Error("All Fields Are Required!!")
    }

    if (name.length < 5) {
        throw Error("Name Should Be More Than 5 Characters Long!!")
    }

    if (!validator.isEmail(email)) {
        throw Error("Invalid Email, Enter Correct Email")
    }

    if (!validator.isStrongPassword(password)) {
        throw Error("Password Is Not Strong")
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const date = new Date();
    let dateDay = date.getDate();
    let dateMonth = date.getMonth();
    let dateYear = date.getFullYear();
    let currentDate = `${dateDay}/${dateMonth}/${dateYear}`;

    const user = await this.create({ name, email, password: hash, department, year, indexNumber, lastLogin: currentDate });

    return user;

}

// static login method
userSchema.statics.login = async function (email, password) {
    
    if (!email || !password) {
        throw Error("All Fields Are Required!!")
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

    const update = { lastLogin: currentDate }

    const doc = await this.findOneAndUpdate(user, update, {
        returnOriginal: false
    });

    return user;
}

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');


const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select : false
    },
    year: {
        type: Number,
        required: true
    },
    subjects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject'
        }
    ],
    gender: {
        type: String
    },
    // registrationNumber: {
    //     type: String
    // },
    department: {
        type: String,
        required: true
    },
    batch: {
        type: String
    },
    dob: {
        type: String,
        required: true,
        trim: true,
    },
    studentMobileNumber: {
        type: Number
    },
    fatherName: {
        type: String
    },
    fatherMobileNumber: {
        type: Number
    },
    role: {
        type: String,
        default: "student",
    },
    
})

studentSchema.methods.getJwtToken = function(){
    const token = jwt.sign({email : this.email,id : this._id,},process.env.KEY);
    return token;
}

studentSchema.pre("save", async function(next){
    if(!this.isModified("password")) next();
    this.password = await bcrypt.hash(this.password,10);
})

studentSchema.methods.comparePassword = async function(enteredPassword){
    const validPassword = await bcrypt.compare(enteredPassword,this.password);
    return validPassword;
}


const studentModel = new mongoose.model("Student",studentSchema);

module.exports = studentModel;


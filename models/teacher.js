const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');


const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true,
        select : false
    },
    gender: {
        type: String,
    },
    department: {
        type: String, 
        required: true
    },
    mobileNumber: {
        type: Number
    },
    dob: {
        type: String,
        required: true
    },
    joiningYear: {
        type: Number,
        required: true 
    },
    subjectsCanTeach: [{
        type: String
    }],
})

teacherSchema.methods.getJwtToken = function(){
    const token = jwt.sign({email : this.email,id : this._id,},process.env.KEY);
    return token;
}

teacherSchema.pre("save", async function(next){
    if(!this.isModified("password")) next();
    this.password = await bcrypt.hash(this.password,10);
})

teacherSchema.methods.comparePassword = async function(enteredPassword){
    const validPassword = await bcrypt.compare(enteredPassword,this.password);
    return validPassword;
}

const teacherModel = new mongoose.model("Teacher",teacherSchema);

module.exports = teacherModel;

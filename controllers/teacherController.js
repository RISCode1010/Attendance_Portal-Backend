const Teacher = require("../models/teacher");
const Student = require('../models/student');
const Subject = require('../models/subject');
const Attendence = require('../models/attendence');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const teacherLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email }).select("+password");

    if (!teacher) {
      return res.status(404).json({
        message: "Invalid email and password",
      });
    }

    const validPassword = await teacher.comparePassword(password);

    if (!validPassword) {
      return res.status(404).json({
        message: "Invalid email and password",
      });
    }

    const token = teacher.getJwtToken();
    res.cookie("teacherToken", token);
    res.status(201).json({message: "Login Successfully", teacher: teacher, token: token });
  } catch (err) {
    res.json(err);
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("teacherToken");
    res.status(200).json({message: "Logout Successfully"});
    res.end();
  } catch (error) {
    res.json(error);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res.status(401).json({message : "user not exist"});
    }

    const token = teacher.getJwtToken();

    // const url = `http://localhost:${process.env.FRONTEND_PORT}/TeacherResetPassword/${token}/`;
    const url = `${process.env.FRONTEND_PORT}/TeacherResetPassword/${token}/`;

    const message = `
        <h1>You have requested a password reset</h1>
        <p>Please make a put request to the following link:</p>
        <a href=${url} clicktracking=off>${url}</a>
        `;

    await sendEmail({
      to: teacher.email,
      subject: "Password Reset Request",
      text: message,
    });
    res.status(200).json({ message: "Kindly check your email for further instructions" });
  } catch (error) {
    res.send(error);
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.status(401).json({
        message: "Password Mismatch",
      });
    }
    let decoded = await jwt.verify(token, process.env.KEY);
    const { id } = decoded;
    const teacher = await Teacher.findById(id).select("+password");

    if (!teacher) {
      return res.json({message : "invalid user"});
    }
    teacher.password = password;
    await teacher.save();
    res.status(200).json({message : "Password Reset"});
  } catch (error) {
    res.status(400).json({
      message: "Password reset token is invalid or has expired.",
    });
  }
};



//! Update Password 
const updatePassword = async(req,res)=>{
  try {
    const {oldPassword, newPassword, confirmNewPassword} = req.body;
    if(newPassword !== confirmNewPassword){
      return res.status(401).json({
        message: "Password Mismatch",
      });
    }

    const{_id}=req.teacher;
    const teacher = await Teacher.findById(_id).select("+password");
    // console.log(user);
    const isCorrect = await bcrypt.compare(oldPassword, teacher.password);
    // console.log(isCorrect);
    if (!isCorrect) {
      return res.status(401).json({
        message: "Invalid Old Password",
      });
    }

    teacher.password = newPassword;

    await teacher.save();

    res.status(200).json({
      message: "Password Update Successfully",
    });

  } catch (error) {
    res.json(error.message);
  }
}


const fetchStudents = async (req, res) => {
  try {
      const { department, year } = req.body;
      const subjectList = await Subject.find({ department, year })
      // if (subjectList.length === 0) {
      //     return res.status(404).json('No Subject found in given department');
      // }
      const students = await Student.find({ department, year })
      // if (students.length === 0) {
      //     return res.status(404).json({result : 'No Student found'});
      // }
      res.status(200).json({
          result: students.map(student => {
              var student = {
                  _id: student.id,
                  email: student.email,
                  name: student.name
              }
              return student
          }),
          subjectCode: subjectList.map(sub => {
            return sub.subjectCode
        })
      })
  }
  catch (err) {
      console.log("error in faculty fetchStudents", err.message)
  }

}


//! Mark Attendence 
const markAttendence = async (req,res)=>{
  try {
    const{selectedStudents, subjectCode, department, year, } = req.body;
    const subject = await Subject.findOne({subjectCode});
    const allStudents = await Student.find({department, year});
    let notSelectedStudents = allStudents.filter((item)=>{ 
      // console.log(item.id);
      // console.log(item._id.valueOf());
      return selectedStudents.indexOf(item._id.valueOf())===-1});
    // console.log(notSelectedStudents);

    for (let i = 0; i < notSelectedStudents.length; i++) {
      const element = notSelectedStudents[i];
      const attendence = await Attendence.findOne({student: element._id, subject: subject._id});
      if (!attendence) {
        const newAttendence = new Attendence({
          student: element._id,
          subject: subject._id
        })
        newAttendence.totalLecturesByTeacher += 1;
        await newAttendence.save();
      } else{
        attendence.totalLecturesByTeacher += 1;
        await attendence.save();
      }
    }

    for (let i = 0; i < selectedStudents.length; i++) {
      const element = selectedStudents[i];
      const attendence = await Attendence.findOne({student: element, subject: subject._id});
      if (!attendence) {
        const newAttendence = new Attendence({
          student: element,
          subject: subject._id
        })
        newAttendence.totalLecturesByTeacher += 1;
        newAttendence.lectureAttended += 1;
        await newAttendence.save();
      } else {
        attendence.totalLecturesByTeacher += 1;
        attendence.lectureAttended += 1;
        await attendence.save();
      }
    }

    res.status(200).json({ message: "Attendance Marked" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: `Error in marking attendence${err.message}` })
  }
}



module.exports = { teacherLogin, logout, forgotPassword, resetPassword, updatePassword, markAttendence, fetchStudents};

const Student = require("../models/student");
const Attendence = require("../models/attendence");
const Subject = require('../models/subject');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email }).select("+password");

    if (!student) {
      return res.status(404).json({
        message: "Invalid email and password",
      });
    }

    const validPassword = await student.comparePassword(password);

    if (!validPassword) {
      return res.status(404).json({
        message: "Invalid email and password",
      });
    }

    const token = student.getJwtToken();
    res.cookie("studentToken", token, {
      expires: new Date(Date.now() + 25892000000),
      httpOnly: true,
      sameSite:'none',
      secure:true
    });
    res.status(201).json({message: "Login Successfully", student: student, token: token });
  } catch (err) {
    res.json(err);
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("studentToken");
    res.status(200).json({message: "Logout Successfully"});
    res.end();
  } catch (error) {
    res.json(error);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(401).json({message : "user not exist"});
    }

    const token = student.getJwtToken();

    // const url = `http://localhost:${process.env.FRONTEND_PORT}/StudentResetPassword/${token}/`;
    const url = `${process.env.FRONTEND_PORT}/StudentResetPassword/${token}/`;

    const message = `
          <h1>You have requested a password reset</h1>
          <p>Please make a put request to the following link:</p>
          <a href=${url} clicktracking=off>${url}</a>
          `;

    await sendEmail({
      to: student.email,
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
    const student = await Student.findById(id).select("+password");

    if (!student) {
      return res.json({message : "invalid user"});
    }
    student.password = password;
    await student.save();
    res.status(200).json({message : "Password Reset"});
  } catch (error) {
    res.status(400).send({
      message: "Password reset token is invalid or has expired.",
    });
  }
};

//! Update Password
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    if (newPassword !== confirmNewPassword) {
      return res.status(401).json({
        message: "Password Mismatch",
      });
    }

    const { _id } = req.student;
    const student = await Student.findById(_id).select("+password");
    // console.log(user);
    const isCorrect = await bcrypt.compare(oldPassword, student.password);
    // console.log(isCorrect);
    if (!isCorrect) {
      return res.status(401).json({
        message: "Invalid Old Password",
      });
    }

    student.password = newPassword;

    await student.save();

    res.status(200).json({
      message: "Password Update Successfully",
    });
  } catch (error) {
    res.json(error.message);
  }
};


//! Check Attendence 
const checkAttendence = async (req, res) => {
  try {
    const { _id } = req.student;
    // console.log(_id);
    // let v = _id.valueOf();
    // console.log('1');
    const attendence = await Attendence.find({ student : _id }).populate('subject').populate('student');
    // console.log('2');
    // console.log(attendence);
    if (!attendence) {
      res.status(400).json({ message: "Attendence not found" });
    }
    res.status(200).json({
      result: attendence.map((att) => {
        let res = {};
        res.subjectCode = att.subject.subjectCode;
        res.subjectName = att.subject.subjectName;
        res.maxLectures = att.subject.totalLectures;
        res.totalLecturesByTeacher = att.totalLecturesByTeacher;
        res.lectureAttended = att.lectureAttended;
        res.absentLectures = att.totalLecturesByTeacher - att.lectureAttended;
        res.attendencePercentage = `${((att.lectureAttended / att.totalLecturesByTeacher) *100).toFixed(2)} %`;
        return res;
      }),
    });
  } catch (err) {
    console.log("Error in fetching attendence",err.message)
  }
};


const getAllSubjects = async (req, res) => {
  try {
      const { department, year } = req.student;
      // console.log(req.student);
      const subjects = await Subject.find({ department, year })
      if (subjects.length === 0) {
          return res.status(404).json({ message: "No subjects founds" })
      }
      res.status(200).json({result: subjects })
  }
  catch (err) {
      return res.status(400).json({"Error in getting all subjects":err.message})
  }
}

module.exports = {
  studentLogin,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  checkAttendence,
  getAllSubjects,
};

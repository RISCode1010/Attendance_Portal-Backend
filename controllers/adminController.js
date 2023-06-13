const Admin = require("../models/admin");
const sendEmail = require("../utils/sendEmail");
const Teacher = require("..//models/teacher");
const Student = require("../models/student");
const Subject = require("../models/subject");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//! Add_Admin
const addAdmin = async (req, res) => {
  try {
    const { name, email, dob, contactNumber, gender } = req.body;

    // console.log(JSON.stringify(req.headers));

    if (!name || !email || !dob || !contactNumber || !gender) {
      return res.status(400).json({
        success: false,
        message: "Probably you have missed certain fields",
      });
    }

    const admin = await Admin.findOne({ email });
    if (admin) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exist" });
    }

    let date = new Date();
    const joiningYear = date.getFullYear();

    const newAdmin = await new Admin({
      name,
      email,
      password: dob,
      joiningYear,
      dob,
      gender,
      contactNumber,
    });

    await newAdmin.save();

    await sendEmail({
      to: email,
      subject: "your Password",
      text: `your password is <b>${dob}</b> <BR> and change it immediately after login`,
    });

    res.status(200).json({
      success: true,
      message: "Admin registered successfully",
      response: newAdmin,
    });
  } catch (err) {
    res.json(err);
  }
};

//! Admin_Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return res.status(404).json({
        message: "Invalid email and password",
      });
    }

    const validPassword = await admin.comparePassword(password);

    if (!validPassword) {
      return res.status(404).json({
        message: "Invalid email and password",
      });
    }

    const token = admin.getJwtToken();
    console.log(`token ${token}`);
    res.cookie("adminToken", token, {
      expires: new Date(Date.now() + 25892000000),
      httpOnly: true,
      sameSite:'none',
      secure:true
    });
    res.status(201).json({message: "Login Successfully", token:token, admin: admin });
  } catch (err) {
    res.json(err);
  }
};

//! Logout
const logout = (req, res) => {
  try {
    res.clearCookie("adminToken", { path: "/" });
    res.status(200).json({message: "Logout Successfully"});
    res.end();
  } catch (error) {
    res.console(error);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({message : "user not exist"});
    }

    const token = admin.getJwtToken();
    // console.log(token);

    // const url = `http://localhost:${process.env.FRONTEND_PORT}/AdminResetPassword/${token}/`;
    const url = `${process.env.FRONTEND_PORT}/AdminResetPassword/${token}/`;

    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please make a put request to the following link:</p>
      <a href=${url} clicktracking=off>${url}</a>
      `;
    // console.log(user.email);
    // console.log(message);

    await sendEmail(
      {
        to: admin.email,
        subject: "Password Reset Request",
        text: message,
      } /*,function(err) {
      if (!err) {
        return res.json({ message: 'Kindly check your email for further instructions' });
      } else {
        return console.log(err);
      }
    }*/
    );
    res.status(200).json({ message: "Kindly check your email for further instructions" });
    // console.log("end");
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
    const admin = await Admin.findById(id).select("+password");

    if (!admin) {
      return res.json({message : "invalid user"});
    }
    admin.password = password;
    await admin.save();
    res.status(200).json({message : "Password Reset"});
  } catch (error) {
    res.status(400).json({
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

    const { _id } = req.admin;
    const admin = await Admin.findById(_id).select("+password");
    // console.log(user);
    const isCorrect = await bcrypt.compare(oldPassword, admin.password);
    // console.log(isCorrect);
    if (!isCorrect) {
      return res.status(401).json({
        message: "Invalid Old Password",
      });
    }

    admin.password = newPassword;

    await admin.save();

    res.status(200).json({
      message: "Password Update Successfully",
    });
  } catch (error) {
    res.json(error.message);
  }
};

//! ADD Student
const addStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      year,
      gender,
      department,
      dob,
      studentMobileNumber,
      fatherName,
      fatherMobileNumber,
    } = req.body;

    const student = await Student.findOne({ email });
    if (student) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exist" });
    }

    let date = new Date();
    const batch = date.getFullYear();

    const newStudent = await new Student({
      name,
      email,
      password: dob,
      year,
      gender,
      department,
      batch,
      dob,
      studentMobileNumber,
      fatherName,
      fatherMobileNumber,
    });

    const subject = await Subject.find({ department, year });
    // if (subject.length === 0) {
    //   return res.status(400).json({ success: false, message: "No branch found for given subject" });
    // } else {
    if (subject.length !== 0) {
      for (let i = 0; i < subject.length; i++) {
        newStudent.subjects.push(subject[i]._id);
      }
    }

    await newStudent.save();

    await sendEmail({
      to: email,
      subject: "your Password",
      text: `your password is <b>${dob}</b> <BR> and change it immediately after login`,
    });

    res.status(200).json({
      success: true,
      message: "Student registered successfully",
      response: newStudent,
    });
  } catch (error) {
    console.log(error);
  }
};

//! ADD Teacher

const addTeacher = async (req, res) => {
  try {
    const { name, email, gender, department, dob, mobileNumber } = req.body;
    const teacher = await Teacher.findOne({ email });
    if (teacher) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exist" });
    }

    let date = new Date();
    const joiningYear = date.getFullYear();

    const newTeacher = await new Teacher({
      name,
      email,
      password: dob,
      gender,
      department,
      dob,
      mobileNumber,
      joiningYear,
    });

    await newTeacher.save();

    await sendEmail({
      to: email,
      subject: "your Password",
      text: `your password is <b>${dob}</b> <BR> and change it immediately after login`,
    });

    res.status(200).json({
      success: true,
      message: "Teacher registered successfully",
      response: newTeacher,
    });
  } catch (error) {
    console.log(error);
  }
};

//! ADD Subject
const addSubject = async (req, res) => {
  try {
    const { subjectName, subjectCode, totalLectures, department, year } =
      req.body;

    const subject = await Subject.findOne({ subjectCode });
    if (subject) {
      return res
        .status(400)
        .json({ success: false, message: "Given Subject is already added" });
    }

    const newSubject = await new Subject({
      department,
      subjectName,
      subjectCode,
      totalLectures,
      year,
    });
    await newSubject.save();

    const students = await Student.find({ department, year });
    // if (students.length === 0) {
    //   return res.status(400).json("No branch found for given subject");
    // } else {
    if (students.length !== 0) {
      for (let i = 0; i < students.length; i++) {
        // console.log(i);
        students[i].subjects.push(newSubject._id);
        await students[i].save();
      }
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Subject registered successfully",
      });

  } catch (error) {
    console.log(error);
  }
};

const getAllTeacher = async (req, res) => {
  try {
    const { department } = req.body;
    const allTeachers = await Teacher.find({ department });
    res.status(200).json({ result: allTeachers });
  }
  catch (err) {
    console.log("Error in gettting Teachers", err.message);
  }
};


const getAllStudent = async (req, res) => {
  try {
    const { department, year } = req.body
    const allStudents = await Student.find({ department, year })
    res.status(200).json({ result: allStudents })
  }
  catch (err) {
    console.log("Error in gettting students", err.message)
  }
}

const getAllSubject = async (req, res) => {
  try {
    const { department, year } = req.body
    const allSubjects = await Subject.find({ department, year })
    res.status(200).json({ result: allSubjects })
  }
  catch (err) {
    console.log("Error in gettting subjects", err.message)
  }
}


module.exports = {
  addAdmin,
  adminLogin,
  logout,
  addStudent,
  addTeacher,
  addSubject,
  forgotPassword,
  resetPassword,
  updatePassword,
  getAllTeacher,
  getAllStudent,
  getAllSubject
};

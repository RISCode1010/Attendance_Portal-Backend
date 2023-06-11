const express = require('express');

const adminAuth = require("../middleware/adminAuth")

const {addAdmin, adminLogin, logout, addStudent, addTeacher, addSubject, forgotPassword, resetPassword, updatePassword, getAllTeacher, getAllStudent, getAllSubject} = require('../controllers/adminController')

const router = express.Router();

router.route("/addAdmin").post(adminAuth,addAdmin);
router.route("/adminLogin").post(adminLogin);
router.route("/adminLogout").get(adminAuth,logout);
router.route("/addStudent").post(adminAuth,addStudent);
router.route("/addTeacher").post(adminAuth,addTeacher);
router.route("/addSubject").post(adminAuth,addSubject);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").put(resetPassword);
router.route("/updatePassword").put(adminAuth,updatePassword);
router.route("/getAllTeacher").post(adminAuth,getAllTeacher);
router.route("/getAllStudent").post(adminAuth,getAllStudent);
router.route("/getAllSubject").post(adminAuth,getAllSubject);


module.exports = router;
const express = require('express');

const teacherAuth = require('../middleware/teacherAuth');

const{teacherLogin, logout, forgotPassword, resetPassword, updatePassword, markAttendence, fetchStudents,} = require('../controllers/teacherController');

const router = express.Router();

router.route("/teacherLogin").post(teacherLogin);
router.route("/logout").get(teacherAuth,logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").put(resetPassword);
router.route("/updatePassword").put(teacherAuth,updatePassword);
router.route("/markAttendence").post(teacherAuth,markAttendence);
router.route("/fetchStudents").post(teacherAuth,fetchStudents);

module.exports = router;
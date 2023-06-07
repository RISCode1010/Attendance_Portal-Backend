const express = require('express');

const studentAuth = require("../middleware/studentAuth")

const{studentLogin, logout, forgotPassword, resetPassword, updatePassword, checkAttendence, getAllSubjects, } = require('../controllers/studentController');


const router = express.Router();

router.route("/studentLogin").post(studentLogin);
router.route("/logout").get(studentAuth,logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").put(resetPassword);
router.route("/updatePassword").put(studentAuth,updatePassword);
router.route("/checkAttendence").get(studentAuth,checkAttendence);
router.route("/allSubjects").get(studentAuth,getAllSubjects);


module.exports = router;
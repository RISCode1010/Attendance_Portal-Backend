const jwt = require('jsonwebtoken');
const Teacher = require("../models/teacher");


const auth = async(req,res,next)=>{ 
    try {
        const {teacherToken} = req.cookies;

        if (!teacherToken) return res.send("Access denied. No token Provided");

            let decoded = jwt.verify(teacherToken,process.env.KEY);

            const{id}=decoded;

            const teacher = await Teacher.findById(id);
            if(!teacher) return res.send("Access denied.");

            req.teacher = teacher;

        next();

    } catch (error) {
        console.log(error);
        req.send("invalid token")
    }
}



module.exports = auth;
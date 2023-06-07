const jwt = require('jsonwebtoken');
const Student = require("../models/student");


const auth = async(req,res,next)=>{ 
    try {
        const {studentToken} = req.cookies;

        if (!studentToken) return res.send("Access denied. No token Provided");

            let decoded = jwt.verify(studentToken,process.env.KEY);

            const{id}=decoded;

            const student = await Student.findById(id);
            if(!student) return res.send("Access denied.");

            req.student = student;

        next();

    } catch (error) {
        console.log(error);
        req.send("invalid token")
    }
}



module.exports = auth;
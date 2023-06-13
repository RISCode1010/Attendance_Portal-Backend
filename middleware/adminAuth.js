const jwt = require('jsonwebtoken');
const Admin = require("../models/admin");


const auth = async(req,res,next)=>{        /* function name => isAuthenticatedUser*/
    try {
        
        const {adminToken} = req.cookies;

        console.log(req.cookies);
        if (!adminToken) return res.send("Access denied. No token Provided");

            let decoded = jwt.verify(adminToken,process.env.KEY);

            const{id}=decoded;
            // console.log(id);

            const admin = await Admin.findById(id);
            if(!admin) return res.send("Access denied.");
            // console.log(user);

            req.admin = admin;
        // res.send(token);

        next();

    } catch (error) {
        console.log(error);
        req.send("invalid token")
    }
}



module.exports = auth;
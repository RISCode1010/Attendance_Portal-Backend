const express = require('express');
const bodyParser = require('body-parser');
const cookieparser = require('cookie-parser');
const cors = require("cors");

const app = express();

// const corsOptions = {
//     origin: true, //included origin as true
//     credentials: true, //included credentials as true
// };

// app.use(cors(corsOptions));

app.use(cookieparser());
app.use(express.json({
    limit: "50mb"
}));

app.use(bodyParser.urlencoded({
    limit : '50mb',
    extended: true
}))

app.use(
	cors({
		origin:"https://tiny-elf-ab2ec3.netlify.app",
		credentials:true,
	})
)

const adminRoute = require('./routes/adminRoute');
const studentRoute = require('./routes/studentRoute');
const teacherRoute = require('./routes/teacherRoute');


app.use("/Admin",adminRoute);
app.use("/Student",studentRoute);
app.use("/Teacher",teacherRoute);


module.exports = app;
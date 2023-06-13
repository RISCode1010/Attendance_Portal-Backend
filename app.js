const express = require('express');
const bodyParser = require('body-parser');
const cookieparser = require('cookie-parser');
var cors = require('cors');

const app = express();


app.use(cookieparser());


const corsOptions = {
    origin: true, //included origin as true
    credentials: true, //included credentials as true
};

app.use(cors(corsOptions));

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//  })

//  app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Replace with the actual origin of your frontend
//     res.setHeader("Access-Control-Allow-Credentials", "true");
//     next();
//   });

app.use(express.json({
    limit: "50mb"
}));

app.use(bodyParser.urlencoded({
    limit : '50mb',
    extended: true
}))

const adminRoute = require('./routes/adminRoute');
const studentRoute = require('./routes/studentRoute');
const teacherRoute = require('./routes/teacherRoute');


app.use("/Admin",adminRoute);
app.use("/Student",studentRoute);
app.use("/Teacher",teacherRoute);


module.exports = app;
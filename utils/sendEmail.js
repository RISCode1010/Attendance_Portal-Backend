const nodemailer = require("nodemailer");


const sendEmail = async (val)=>{

    // console.log("A");
    const transporter = nodemailer.createTransport({
        host : process.env.HOST,
        service: 'gmail',
        port: "587",
        authentication: 'plain',
        secure: false,
        // tls: {
        //     ciphers: "SSLv3",
        //     rejectUnauthorized: false,
        // },
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
        connectionTimeout: 5 * 60 * 1000
    })
    // console.log("B");
    const mail = {
        from: process.env.EMAIL_FROM,
        to: val.to,
        subject: val.subject,
        html: val.text
    };
    // console.log("C");
    await transporter.sendMail(mail,function(err,info){
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    });
}

module.exports = sendEmail;
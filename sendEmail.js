const { sender, reciever } = require("./secret-data");

const nodemailer = require("nodemailer");

function sendEmail() {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: sender.email,
            pass: sender.password,
        },
    });

    const mailOptions = {
        from: sender.email,
        to: reciever.email,
        subject: "check if in stock",
        text: "factual",
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}

module.exports = { sendEmail };

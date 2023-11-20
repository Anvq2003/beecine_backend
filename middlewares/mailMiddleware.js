require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.net',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendMailMiddleware = async (req, res, next) => {
  const info = await transporter.sendMail({
    from: {
      name: 'Beecine',
      address: process.env.EMAIL,
    },
    to: 'anvqps20351@fpt.edu.vn',
    subject: 'Hello ✔',
    text: 'Hello world?',
    html: '<b>Hello world?</b>',
  });
  console.log(info);
  next();
};

module.exports = { sendMailMiddleware };

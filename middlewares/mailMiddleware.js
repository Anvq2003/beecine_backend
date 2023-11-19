const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.forwardemail.net',
  port:587,
  secure: false,
  auth: {
    user: 'voquocan99@gmail.com',
    pass: 'ggQuocAn150403@#',
  },
});

const sendMailMiddleware = (req, res, next) => {
  const info = transporter.sendMail({
    from: '"Quoc An" <voquocan99@gmail.com>',
    to: 'anvqps20351@fpt.edu.vn',
    subject: 'Hello ✔',
    text: 'Hello world?',
    html: '<b>Hello world?</b>',
  });
  console.log(info);
  next();
};

module.exports = { sendMailMiddleware };

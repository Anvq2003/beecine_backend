const transporter = require('../services/mailService');

const sendMail = async (info) => {
  await transporter.sendMail(info);
};

module.exports = {
  sendMail,
};

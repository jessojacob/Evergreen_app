var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.emailID,
    pass: process.env.password
  }
});

module.exports = transporter
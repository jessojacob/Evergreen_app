var nodemailer = require('nodemailer');
const CONFIG = require('../env/config');

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: CONFIG.emailID,
    pass: CONFIG.password
  }
});

module.exports = transporter
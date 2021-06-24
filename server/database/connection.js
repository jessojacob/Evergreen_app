const mysql = require('mysql');
const CONFIG = require('../env/config');

var connectDB = mysql.createConnection({
    host: CONFIG.host,
    port: CONFIG.db_port,
    user: CONFIG.user,
    password: CONFIG.db_password,
    database:CONFIG.database
  });
  
  connectDB.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });


module.exports = connectDB
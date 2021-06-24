const mysql = require('mysql');

var connectDB = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "root",
    database:"userdb"
  });
  
  connectDB.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });


module.exports = connectDB
/*const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name : {
        type : String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    gender : String,
    status : String
})

const Userdb = mongoose.model('userdb', schema);

module.exports = Userdb;*/

/*const connectDB = require('../database/connection');

connectDB.query("CREATE DATABASE userdb",(err,result)=>{
    if (err) throw err;
    console.log("Database created");
} )*/
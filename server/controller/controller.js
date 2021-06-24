var Userdb = require('../model/model');
var connectDB = require('../database/connection')
const CONFIG = require('../config/Settings');
const CalendarAPI = require('node-google-calendar');
const transporter = require('../services/gmail');
let cal = new CalendarAPI(CONFIG);
var moment = require('moment-timezone');

// search user
exports.search = (req,res)=>{
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
    if (req.query.id){
        var sql = "SELECT p._id,p.name,p.email,p.phone_no,p.gender,p.status,m.member_id,m.member_name,c.session_id,c.create_date,c.remarks,c.prescription FROM patients p JOIN members m on p._id=m._id LEFT OUTER JOIN consultations c ON c.member_id=m.member_id WHERE m.member_id = ? order by c.create_date DESC LIMIT 5";
    // var select = "p.name,p.email,p.gender,p.status,c.create_date,c.remarks,c.prescription"
        connectDB.query(sql,[req.query.id],(err,result)=>{
            //if (err) throw err;
            if(!result){
                res.status(404).send({ message : "Not found user with email "+ req.query.phone})
            }else{
                var format = 'YYYY-MM-DD HH:mm:ss ZZ';
                for (var i=0;i<result.length;i++){
                 result[i].create_date=moment.tz(result[i].create_date, "Asia/Calcutta").format(format)
                }
                console.log(result[0].create_date)
                res.send(result)
            }
        } )
    }
    else if (req.query.phone){
        var sql = "SELECT  p._id,p.name,p.email,p.phone_no,p.gender,p.status,m.member_id,m.member_name,m.member_gender FROM patients p LEFT OUTER JOIN members m ON p._id=m._id WHERE phone_no = ?"
        connectDB.query(sql,[req.query.phone],(err,result)=>{
            //if (err) throw err;
            if(!result){
                es.status(404).send({ message : "Not found user with phone number "+ req.query.phone})
            }else{
                res.send(result)
            }
        } )
    }
}


// create and save new user
exports.create_user = (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }

    var value = new Array(req.body.name,req.body.email,req.body.phone,req.body.gender,req.body.status);
    var sql = "INSERT INTO patients (name,email,phone_no,gender,status) VALUES (?)";
    connectDB.query(sql, [value], (err,result)=>{
        if (err) throw err;
        if(!result){
            res.send("Consulation creation failed"+ email)
        }else{
            console.log("Number of patient records inserted: " + result.affectedRows);
            sql = "SELECT _id FROM patients where phone_no=?"
            connectDB.query(sql, [req.body.phone], (err,result)=>{
                if (err) throw err;
                sql = "INSERT INTO members (member_name,_id,create_date,member_gender) VALUES (?,?,current_date,?)";
                connectDB.query(sql, [req.body.name,result[0]._id,req.body.gender], (err,result)=>{
                    if (err) throw err;
                    console.log("Number of member records inserted: " + result.affectedRows);
                    res.redirect('/add-user');
                } )
            } )
        }
    } )

}

exports.create_member = (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }

    var sql = "INSERT INTO members  (member_name,_id,create_date,member_gender) VALUES (?,?,current_date,?)";
    connectDB.query(sql, [req.body.name,req.body.id,req.body.gender], (err,result)=>{
        if (err) throw err;
        if(!result){
            res.send("Consulation creation failed"+ email)
        }else{
            console.log("Number of member records inserted: " + result.affectedRows);
            sql = "SELECT phone_no from patients where _id=?"
            connectDB.query(sql, [req.body.id], (err,result)=>{
                if (err) throw err;
                var redirect='/member_list?phone='.concat(result[0].phone_no)
                res.redirect(redirect);
            } )
        }
    } )

}

//search for slot availability for given date
exports.find_slot = async (req,res)=>{

    var slot = []
    
    console.log("req.query.id1 "+req.query.id)
    slot.push(req.query.id)
    slot.push(req.query.date)

    console.log("slot1 "+slot)

    var f=0

    for(i=9;i<18;i++) {  
        if(i!==12 && i!==13 && i!==14 ) {
            var timemin=req.query.date.concat('T',i,':00:00+05:30')
            var timemax=req.query.date.concat('T',i+1,':00:00+05:30')
            let params = {
                "timeMin": timemin,
                "timeMax": timemax,
                "items": [{ "id": CONFIG.calendarId['primary']}],
                "timeZone": CONFIG.timezone
                };

                await cal.FreeBusy.query(CONFIG.calendarId['primary'], params)
                .then(resp => {
                    f++;
                    console.log(slot)
                    if(resp.length>0){
                        slot.push('busy')
                    }
                    else{
                        slot.push('free')
                    }
                    if (f==6){
                        res.send(slot)
                    }
                })
                .catch(err => {
                console.log('Error: checkBusy -' + err.message);
                });
        }
        
    }

}


// retrieve and return all users/ retrive and return a single user
exports.find = (req, res)=>{

    if(req.query.id){
        const id = req.query.id;

        var sql = "SELECT * FROM patients WHERE _id = ?";
        connectDB.query(sql,[req.query.id],(err,result)=>{
            if (err) throw err;
            console.log(result[0].name);
            res.send(result);
        })

    }else{
        Userdb.find()
            .then(user => {
                res.send(user)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
            })
    }

    
}

// Update a new idetified user by user id
exports.update = (req, res)=>{
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const id = req.params.id;
    
    var sql = "UPDATE patients SET name=?,email=?,phone_no=?,gender=?,status=? WHERE _id=?"
    var values = new Array(req.body.name,req.body.email,req.body.phone,req.body.gender,req.body.status);

    connectDB.query(sql, [req.body.name,req.body.email,req.body.phone,req.body.gender,req.body.status,id], (err,result)=>{
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
        if(!result){
            res.status(404).send({ message : `Cannot Update user with ${id}. Maybe user not found!`})
        }else{
            res.send(result)
        }
    } )
}

// Delete a user with specified user id in the request
exports.delete = (req, res)=>{
    const id = req.params.id;

    Userdb.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "User was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
}

// Book slot IN CALENDAR and insert in DB
exports.book_slot = async (req, res)=>{

    if (req.params.date=='' || req.params.id==''){
        res.send(2)
    }

    console.log('req.params.date'+req.params.date)
    console.log('req.params.id'+req.params.id)

    var fromDate= req.params.date

    var split=req.params.date.split('T',2)
    var book_date = split[0].slice(0,10)
    split1 = split[1].split(':',2)
    split1[0]=Number(split1[0])
    hours = split1[0]+1
    
    var toDate = split[0].concat('T',hours,':00:00+05:30')

    console.log('book_date'+book_date)


    var sql = "SELECT p._id,p.name,p.email,p.phone_no,m.member_id,m.member_name FROM patients p join members m on m._id=p._id WHERE member_id = ?";
    connectDB.query(sql,[req.params.id],(err,result)=>{
        
        if(result.length==0){
            res.send('1')
        }else{
            //book calendar slot********************************
            var name=result[0].member_name
            var email=result[0].email
            var member_id=result[0].member_id
            console.log('email2' + email )
            let event = {
                'start': { 'dateTime': fromDate },
                'end': { 'dateTime': toDate },
                'location': 'Phone call',
                'summary': name ,
                'status': 'confirmed',
                'description': '',
                'colorId': 1
            }
            cal.Events.insert(CONFIG.calendarId['primary'], event)
                    .then(resp => {
                        console.log('inserted event:');
                        //Insert slot booked in session table*********************
                        sql = "INSERT INTO consultations (member_id,create_date,update_ts) VALUES ('?',?,current_timestamp)";
                        connectDB.query(sql, [result[0].member_id,book_date], (err,res1)=>{
                            if (err) throw err;
                            if(!result){
                                res.send("Consulation creation failed"+ email)
                            }else{
                                console.log("Number of records inserted: " + res1.affectedRows);
                                //sent email**********************************
                                var split= req.params.date.split('T',2)
                                var date = split[0]
                                var from = split[1].split('+',1)

                                var mail_text = "Hi "+ name + ",\n" + "Please be informed that you slot has been successfully booked for date: " + date + " time: " + from + ".";
                                console.log(mail_text)

                                var mailOptions = {
                                    from: 'jessojacob01@gmail.com',
                                    to: email,
                                    subject: 'Evergreen: slot booked',
                                    text: mail_text
                                };
                                
                                transporter.sendMail(mailOptions, function(error, info){
                                    if (error) {
                                    console.log(error);
                                    } else {
                                    console.log('Email sent: ' + info.response);
                                    response = new Array('0',member_id)
                                    res.send(response)
                                    }
                                }); 
                            }   
                        } )
                    })
                    .catch(err => {
                        console.log('Error: insertEvent-' + err.message);
                    })
        }
    } ) 
    

}

async function send_email(email, fromTS, name){

    var split= fromTS.split('T',2)
    var date = split[0]
    var from = split[1].split('+',1)

    var mail_text = "Hi "+ name + ",\n" + "Please be informed that you slot has been successfully booked for date: " + date + " time: " + from + ".";
    console.log(mail_text)

    var mailOptions = {
        from: 'jessojacob01@gmail.com',
        to: email,
        subject: 'Evergreen: slot booked',
        text: mail_text
      };
      
    await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          return(0)
        }
    });
}
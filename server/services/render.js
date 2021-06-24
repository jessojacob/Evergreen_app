const axios = require('axios');


exports.homeRoutes = (req, res) => {
    // Make a get request to /api/users
    axios.get('http://localhost:3000/api/users')
        .then(function(response){
            res.render('patien_view', { users : response.data });
        })
        .catch(err =>{
            res.send(err);
        })

    
}

exports.Patient_view = (req, res) => {
    // Make a get request to /api/users
    axios.get('http://localhost:3000/api/users',{ params : { id : req.query.id }})
        .then(function(response){
            console.log('response'+response.data)
            res.render('patient_view', { users : response.data });
        })
        .catch(err =>{
            res.send(err);
        })
        
}

exports.Member_list = (req, res) => {
    // Make a get request to /api/users
    axios.get('http://localhost:3000/api/users',{ params : { phone : req.query.phone }})
        .then(function(response){
            console.log('response'+response.data)
            res.render('member_list', { users : response.data });
        })
        .catch(err =>{
            res.send(err);
        })
        
}

exports.slot_list = (req, res) =>{
    console.log('req.query.session '+req.query.session)
    axios.get('http://localhost:3000/api/consultation', { params : { date : req.query.session, id : req.query.member_id }})
        .then(function(response){
          //  console.log("slot: "+response.data)
            res.render("consultation_view", { slot : response.data, member_id:''})
        })
        .catch(err =>{
            res.send(err);
        })
}

exports.consultation_view = (req, res) =>{
    console.log('req.query.id '+req.query.id)
    res.render("consultation_view", { slot:'',member_id:req.query.id})
}

exports.add_user = (req, res) =>{
    res.render('add_user');
}

exports.Add_member = (req, res) =>{
    console.log('req.query.id '+req.query.id)
    res.render("add_member", { id:req.query.id})
}

exports.update_user = (req, res) =>{
    console.log('req.query.id'+req.query.id)
    axios.get('http://localhost:3000/api/users/findid', { params : { id : req.query.id }})
        .then(function(userdata){
            res.render("update_user", { user : userdata.data[0]})
        })
        .catch(err =>{
            res.send(err);
        })
}


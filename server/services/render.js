const axios = require('axios');
const { response } = require('express');


exports.homeRoutes = (req, res) => {
    // Make a get request to /api/users
    axios.get('http://'+req.get('host')+'/api/users')
        .then(function(response){
            res.render('patien_view', { users : response.data });
        })
        .catch(err =>{
            res.send(err);
        })

    
}

exports.Patient_view = (req, res) => {
    // Make a get request to /api/users
    console.log("req.query."+req.query.id)
    console.log("req.query.admin1"+req.query.admin)
    axios.get('http://'+req.get('host')+'/api/users',{ params : { id : req.query.id }})
        .then(function(response){
            console.log('response'+response.data)
            res.render('patient_view', { users : response.data,admin:req.query.admin });
        })
        .catch(err =>{
            res.send(err);
        })
        
}

exports.Member_list = (req, res) => {
    // Make a get request to /api/users
    console.log("req: "+req.get('host'))
    console.log(req.query)
    axios.get('http://'+req.get('host')+'/api/users',{ params : { phone : req.query.phone }})
        .then(function(response){
            console.log('response'+response.data)
            res.render('member_list', { users : response.data, admin : req.query.admin });        
        })
        .catch(err =>{
            res.send(err);
        })
        
}

exports.Member_search = (req, res) => {
    // Make a get request to /api/users
    console.log("req: "+req.get('host'))
    axios.get('http://'+req.get('host')+'/api/users',{ params : { name : req.query.name }})
        .then(function(response){
            console.log('response'+response.data)
            res.render('member_search', { users : response.data, admin : req.query.admin });        
        })
        .catch(err =>{
            res.send(err);
        })
        
}

exports.slot_list = (req, res) =>{
    console.log('req.query.session '+req.query.session)
    axios.get('http://'+req.get('host')+'/api/consultation', { params : { date : req.query.session, id : req.query.member_id, admin : req.query.admin  }})
        .then(function(response){
          console.log("slot: "+response.data[0])
         console.log("slot1: "+response.data[1])
        res.render("consultation_view", { slot : response.data[0], member_id:'', admin : response.data[1]})
        })
        .catch(err =>{
            res.send(err);
        })
}

exports.consultation_view = (req, res) =>{
    console.log('req.query.id '+req.query.id)
    res.render("consultation_view", { slot : '', member_id : req.query.id, admin : req.query.admin})
}

exports.add_user = (req, res) =>{
    res.render('add_user');
}

exports.Admin_login = (req, res) =>{
    console.log(req.query.login)
    res.render('admin_login',{ login : req.query.login });
}

exports.Add_member = (req, res) =>{
    console.log('req.query.id '+req.query.id)
    res.render("add_member", { id:req.query.id})
}

exports.update_user = (req, res) =>{
    console.log('req.query.id'+req.query.id)
    axios.get('http://'+req.get('host')+'/api/users/findid', { params : { id : req.query.id }})
        .then(function(userdata){
            res.render("update_user", { user : userdata.data[0]})
        })
        .catch(err =>{
            res.send(err);
        })
}

exports.Update_prescription = (req, res) =>{
    console.log('req.query.id'+req.query.id)
    axios.get('http://'+req.get('host')+'/api/prescription', { params : { session_id : req.query.id }})
        .then(function(response){
            console.log('response'+response.data)
            res.render("prescription", { prescription : response.data[0], admin : req.query.admin})
        })
        .catch(err =>{
            res.send(err);
        })
}


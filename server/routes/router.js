const express = require('express');
const route = express.Router()

const services = require('../services/render');
const controller = require('../controller/controller');

/**
 *  @description first page
 *  @method GET /
 */
 route.get('/',(req,res)=>{
     res.render('patient_page')
 })

 /**
 *  @description patient login
 *  @method GET /
 */
  route.get('/patient-login',(req,res)=>{
    res.render('patient_login')
})

/**
 *  @description List of members
 *  @method GET /
 */
 // route.get('/patient-view',(req,res)=>{
   //res.render('patient_view')
   route.get('/member_list', services.Member_list);
   //})

 /**
 *  @description existing patient view
 *  @method GET /
 */
 // route.get('/patient-view',(req,res)=>{
   //res.render('patient_view')
    route.get('/patient-view', services.Patient_view);
//})

 /**
 *  @description existing patient view
 *  @method GET /
 */
 // route.get('/patient-view',(req,res)=>{
   //res.render('patient_view')
   route.get('/add-member', services.Add_member);
   //})

/**
 *  @description consulation view
 *  @method GET /
 */
// route.get('/consultation-view',(req,res)=>{
  //res.render('consultation_view',{ slot : '' })
//})
route.get('/consultation-view', services.consultation_view);

/**
 *  @description Slot list
 *  @method GET /
 */
 route.get('/slot-list', services.slot_list);

 /**
 *  @description Slot list
 *  @method GET /
 */
  //route.get('/book-slot', services.book_slot);

/**
 *  @description Root Route
 *  @method GET /
 */
//route.get('/', services.homeRoutes);

/**
 *  @description add users
 *  @method GET /add-user
 */
route.get('/add-user', services.add_user)

/**
 *  @description for update user
 *  @method GET /update-user
 */
route.get('/update-user', services.update_user)


// API
route.post('/api/users', controller.create_user);
route.post('/api/member', controller.create_member);
route.get('/api/users/findid', controller.find);
route.put('/api/users/:id', controller.update);
route.delete('/api/users/:id', controller.delete);
route.get('/api/users', controller.search);
route.get('/api/consultation', controller.find_slot);
route.post('/api/slot/:date/:id',controller.book_slot);


module.exports = route
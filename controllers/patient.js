const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Appointment = require("../models/appointment");
const Doctor = require('../models/doctor');
const Patient = require("../models/patient");


exports.addPatient = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const phone_number = req.body.phone_number;
    const date_of_birth = req.body.date_of_birth;
    const age = req.body.age;
    const street_address = req.body.street_address;
    const city = req.body.city;
    const country = req.body.country;

    //Add in DB
  try {
    const hashedPw = await bcrypt.hash(password, 12);
    const added_patient = await Patient.create({
                                        username: username,
                                        email: email,
                                        password: hashedPw,
                                        first_name: first_name,
                                        last_name: last_name,
                                        phone_number: phone_number,
                                        date_of_birth: date_of_birth,
                                        age: age,
                                        street_address: street_address,
                                        city: city,
                                        country: country
                                    })

        if (!added_patient) {
            return  res.status(404).json({message: 'Could not add patient'});
     }
  res.status(200).json({
                 message: 'Patient Added!',
                 patient: added_patient
            });
    }

    catch(err)
    {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      err.message="Internal Server Error"
      next(err);
    }

};

exports.getProfile = async (req, res, next) => {
  const patientId = req.userId;

  try {
    const selected_patient = await Patient.findByPk(patientId)
    if (!selected_patient) {
          return res.status(404).json({message: 'Could not find patient'});
      }
        res.status(200).json({
                message: 'Patient Profile',
                patient: selected_patient
            });
  }  

  catch(err)
    {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      err.message="Internal Server Error!";
      next(err);
    }
       
};

exports.updateProfile = async (req, res, next) => {
    const patientId= req.userId;
    const updatedFirstName = req.body.updated_first_name;
    const updatedLastName = req.body.updated_last_name;

  try {
    let selected_patient = await Patient.findByPk(patientId);
    if (!selected_patient) {
      return res.status(404).json({message: 'Could not find patient'});
    }

    if(selected_patient.first_name === updatedFirstName && selected_patient.last_name === updatedLastName) {
    return res.status(401).json({message: "Updated data is the same as the old ones!"});
  }
        selected_patient.first_name = updatedFirstName;
        selected_patient.last_name = updatedLastName;
        
        selected_patient = await selected_patient.save(); 
        if(!selected_patient) {
         return res.status(404).json({message: 'Error saving updated data'});
        }
        
        res.status(200).json({
                message: "Patient Updated!",
                patient: selected_patient
            });
  }
  
  catch(err)
    {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      err.message="Internal Server Error!";
      next(err);
    }

};

exports.bookAppointment = async (req, res, next) => {
    const start_time = req.body.start_time;
    const appointment_date = req.body.appointment_date;
    const doctor_id = req.body.doctor_id
    const patientId = req.userId;
   try{
   const selectedPatient = await  Patient.findByPk(patientId)
   if (!selectedPatient) {
    return res.status(404).json({message: 'Could not find patient'});
  }
   const appointment = await selectedPatient.createAppointment(
     {
    start_time: start_time,
    appointment_date:  appointment_date,
    doctorId: doctor_id,
    appointmentStatusId: 1
     });

   if (!appointment) {
    return res.status(404).json({message: 'Could not add appointment!'});
  }           
  res.status(200).json({ message: "Appointment Added Successfully !"});
    }
    catch(err)
    {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      err.message="Internal server error!!"
      next(err);
    }
  
};

exports.getAppointments = async (req, res, next) => {
    const patientId = req.userId;
try {
    const selected_patient = await Patient.findByPk(patientId);
    if (!selected_patient) {
      return res.status(404).json({message: 'Could not find patient'});
    }

    const selected_appointments = await  selected_patient.getAppointments(); 
    if (!selected_appointments.length) {
      return res.status(404).json({message: 'No appointments found'});
    }
           
    res.status(200).json({
                   message: "Patient Appointments",
                   appointments: selected_appointments
               })
 }
          
catch(err)
    {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      err.message="Internal Server Error!";
      next(err);
    }
};

exports.patientLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedPatient;

  try { 
    const patient = await Patient.findOne({
      where: {
        email: email
      }
    });
   if(!patient) {
        res.status(401).json({ message: 'Invalid Email!' });
    }
    
    loadedPatient = patient;
    // BUGGGGGGGGGGGGGGGGGGGGGGGGGGG
    let isEqual = bcrypt.compare(password, patient.password);
    if(!isEqual){
        res.status(401).json({ message: 'Invalid Password!' });
      }

    const token = jwt.sign({
                    userId: loadedPatient.id.toString()
              },
               'yashfy-secret-key',
               {expiresIn: '1h'}
             );
    res.status(200).json({token: token, userId: loadedPatient.id.toString() });
  }

  catch(err)
  {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    err.message="Internal Server Error!";
    next(err);
  }
};

exports.cancelPatientAppointment = async (req, res, next)=>{

    // Should notify patient!!
    try{
      const patientID = parseInt(req.userId)
      const AppointmentId = parseInt(req.body.AppointmentId)
  
      selectedAppointment = await Appointment.findByPk(AppointmentId)
  
      if (!selectedAppointment) {
        return res.status(404).json({message: 'An Appointment with this ID could not be found.'});
      }
      
      if (selectedAppointment.patientId !== patientID ) {
        return res.status(404).json({message: 'Invalid selected Appointment.'});
      }
      // WHAT IF ALREADY CANCELD ***
      selectedAppointment.set(
          {
            appointmentStatusId: 3 //Canceled 
          }
      )
      await selectedAppointment.save()
  
      // MUST ADDD await notify patient (webSocket)***
  
      res.status(200).json({ message: 'Appointments canceled successfully !.', appointments: selectedAppointment });
    
    
    }
    catch(err)
    {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
  
exports.makeReview = async (req,res,next)=> {

    const patientId = parseInt(req.userId)
    const review = req.body.review
    const is_review_annoymous = req.body.is_review_annoymous // ** when show it hide the user name!
    const doctorId = req.body.doctorId

    try{
      const selectedPatient = await Patient.findByPk(patientId)

      if(!selectedPatient){
        return res.status(404).json({message: 'Could not find patient'});
      }

      // ** You should verify That Appointment with this doctor exists and its status is COMPLETE !! before Add the review
      
      const newReview = await selectedPatient.createReview( {
        is_review_annoymous:  is_review_annoymous,
        review: review  ,
        doctorId:  doctorId
      })

      // ** CALL ML API TO Assigne polarities and update Doctor Categories !
      const selectedDoctor = await Doctor.findByPk(doctorId)

      if(!selectedDoctor)
      {
        return res.status(404).json({message: 'Could not find doctor.'});
      }
     
      // set doctor Catgs here ....
      ```
      selectedDoctor.set({
        catgs_Clinic:,
        catgs_doctor_treatment:  ,
        catgs_staff:  ,
        catgs_waiting_time:  ,
        catgs_equipment:  ,
        catgs_price:  ,
        catgs_Other:  ,
        general_rank:  
        });
      // update the database 
      const updatedDoctor = await selectedDoctor.save()
      ```
      res.status(201).json(
        { message: "Review is Added Successfully !", doctorId: newReview.doctorId, patientId: patientId  });
    }
    catch(err)
    {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      err.message = "ERROR: Review Not ADDDD ..";
      next(err);
    }
  }
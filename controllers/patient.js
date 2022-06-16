const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Appointment = require("../models/appointment");
const Doctor = require('../models/doctor');
const Doctor_available_slot = require('../models/doctor_available_slot');
const Hospital = require('../models/hospital');
const Insurance = require('../models/insurance');
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
    const insurance_id = req.body.insurance_id ;

    //Add in DB
  try {
    const hashedPw = await bcrypt.hash(password, 12);

    const selectedInsurance = await  Insurance.findByPk(insurance_id)
    if (!selectedInsurance) {
     return res.status(404).json({message: 'No Such Insurance'});
     }

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
                                        country: country,
                                        insuranceId: insurance_id
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
    const day_of_week = req.body.day_of_week;
    const doctor_id = req.body.doctor_id
    const slotId =  req.body.slotId;
    const patientId = req.userId;
   try{

   const selectedPatient = await  Patient.findByPk(patientId)
   if (!selectedPatient) {
    return res.status(404).json({message: 'Could not find patient'});
    }
    let bookedSlot = await Doctor_available_slot.findByPk(slotId)
    if (!bookedSlot) {
      return res.status(404).json({message: 'eroor slot'});
    }

   const appointment = await selectedPatient.createAppointment(
     {
    start_time: start_time,
    day_of_week:  day_of_week,
    doctorId: doctor_id,
    appointmentStatusId: 1
     });

    if (!appointment) {
      return res.status(404).json({message: 'Could not add appointment!'});
    }     
     
  
    // set this slot in doctor to be un-availbale

    bookedSlot.is_available = 0
    bookedSlot = await bookedSlot.save(); 


  res.status(200).json({ message: "Appointment Added Successfully !"});
    }
    catch(err)
    {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      err.message="Error in adding Appointment!!"
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
  try{
  //compare email
  const searchedPatient = await Patient.findOne({
    where: {
      email: email
    }
  });
  if (!searchedPatient) {
    return res.status(401).json(
      { Error_message: 'A Patient with this email could not be found.' });
  }

  //compare password
  let passEqula= await bcrypt.compare(password, searchedPatient.password);
  if (!passEqula) {
    res.status(401).json({ Error_message: 'Wrong password!'});
    return;
  }
  //creat token for 1-hour
  const createdToken = jwt.sign(
    {
      email: searchedPatient.email,
      userId: searchedPatient.id
    },
    'yashfy-secret-key',
   /* { expiresIn: '1h' }*/
  );
  res.status(200).json(
    { token: createdToken, userId: searchedPatient.id });
  }
  catch(err)
  {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    err.message="Internal Server Error!";
    next(err);
  }

}
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


      /* // ** CALL ML API TO Assigne polarities and update Doctor Categories !
      const selectedDoctor = await Doctor.findByPk(doctorId)

      if(!selectedDoctor)
      {
        return res.status(404).json({message: 'Could not find doctor.'});
      }
     */
      // set doctor Catgs here ....


      res.status(201).json(
        { message: "Review is Added Successfully !", doctorId: newReview.doctorId, patientId: patientId , revieww: newReview });
    }
    catch(err)
    {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      err.message = "ERROR: Review Not ADDed ..";
      next(err);
    }
  }
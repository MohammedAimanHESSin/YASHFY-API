const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Appointment = require("../models/appointment");
const Doctor = require('../models/doctor');
const Patient = require("../models/patient");


exports.addPatient = (req, res, next) => {
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
    bcrypt
        .hash(password, 12)
        .then(hashedPw => {
             return Patient.create({
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
        })
        .then( patient => {
            res.status(200).json({
                 message: 'Patient Added!',
                 patient: patient
            });
        })
        .catch(err => {
          if (!err.statusCode) {
          err.statusCode = 500;
          err.message="Account ALREADY EXISTS"
                      }
        next(err);
       });
};

exports.getProfile = (req, res, next) => {
    const patientId = req.userId;
    Patient.findByPk(patientId)
        .then(patient => {
            res.status(200).json({
                message: 'Patient Profile',
                patient: patient
            });
        })
        .catch(err => console.log(err));
};

exports.updateProfile = (req, res, next) => {
    const patientId= req.userId;
    const updatedFirstName = req.body.updated_first_name;
    const updatedLastName = req.body.updated_last_name;

  let updatedPatient = Patient.findByPk(patientId)
        .then(patient => {
            patient.first_name = updatedFirstName;
            patient.last_name = updatedLastName;
            updatedPatient = patient;
            return patient.save(); 
        })
        .then(result => {
            res.status(200).json({
                message: "Patient Updated!",
                patient: updatedPatient
            });
        })
        .catch( err => console.log(err));
};

exports.bookAppointment = async (req, res, next) => {
    const start_time = req.body.start_time;
    const appointment_date = req.body.appointment_date;
    const doctor_id = req.body.doctor_id
    const patientId = req.userId;
   try{
   const selectedPatient = await  Patient.findByPk(patientId)
   if (!selectedPatient) {
    const error = new Error('Could not find Patient.');
    error.statusCode = 404;
    throw error;
  }
   const appointment = await selectedPatient.createAppointment(
     {
    start_time: start_time, appointment_date:  appointment_date,  doctorId: doctor_id, appointmentStatusId: 1
   })

   if (!appointment) {
    const error = new Error('Could not Add Appointment.');
    error.statusCode = 404;
    throw error;
  }           
  res.status(200).json({ message: "Appointment Added Successfully !"});
    }
    catch(err)
    {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      err.message="Duplicate Appointments!!"
      next(err);
    }
  
};

exports.getAppointments = (req, res, next) => {
    const patientId = req.userId;
    
    Patient.findByPk(patientId)
           .then(patient => {
             return  patient.getAppointments()
           })
           .then(appointments => {
               res.status(200).json({
                   message: "Patient Appointments",
                   appointments: appointments
               })
           })
           .catch(err => console.log(err));
};

exports.patientLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    let loadedPatient;

    Patient.findOne({ email: email })
           .then(patient => {
               if(!patient) {
                   res.status(401).json({ message: 'Invalid Email!' });
               }
               loadedPatient = patient;
               return bcrypt.compare(password, patient.password);
           })
           .then(isEqual => {
               if(!isEqual){
                res.status(401).json({ message: 'Invalid Password!' });
               }
               const token = jwt.sign(
               {
                    userId: loadedPatient.id.toString()
               },
               'yashfy-secret-key',
               {expiresIn: '1h'}
             );
             res.status(200).json({token: token, userId: loadedPatient.id.toString() });
           })
           .catch(err => {
              if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
           });
};

exports.cancelPatientAppointment = async (req, res, next)=>{

    // Should notify patient!!
    try{
      const patientID = parseInt(req.userId)
      const AppointmentId = parseInt(req.body.AppointmentId)
  
      selectedAppointment = await Appointment.findByPk(AppointmentId)
  
      if (!selectedAppointment) {
        const error = new Error('An Appointment with this ID could not be found.');
        error.statusCode = 401;
        throw error;
      }
      console.log(selectedAppointment.patientId)
      if (selectedAppointment.patientId !== patientID ) {
        const error = new Error('Invalid selected Appointment');
        error.statusCode = 401;
        throw error;
      }
      // WHAT IF ALREADY CANCELD ***
      selectedAppointment.set(
          {
            appointmentStatusId: 3 //Canceled 
          }
      )
      await selectedAppointment.save()
  
      // MUST ADDD await notify patient (webSocket)***
  
      res.status(200).json({ message: 'Appointments canceld Successfully !.', appointments: selectedAppointment });
    
    
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

      if(!selectedPatient)
      {
        const err = new Error("NO SUCH PATIENT")
        error.statusCode = 404;
        throw error;
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
        const err = new Error("NO SUCH DOCTOR")
        error.statusCode = 404;
        throw error;
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
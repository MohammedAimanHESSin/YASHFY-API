const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Appointment = require("../models/appointment");
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
        .catch(err => console.log(err));
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

exports.bookAppointment = (req, res, next) => {
    const start_time = req.body.start_time;
    const patientId = req.userId;
    
    Patient.findByPk(patientId)
           .then(patient => {
                 patient.createAppointment({
                 start_time: start_time    
                })
                res.status(200).json({ message: "Appointment Added!"});
            })
            .catch(err => console.log(err));
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
           .catch(err => console.log(err));
};
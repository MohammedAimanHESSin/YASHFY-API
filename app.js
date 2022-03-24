const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');

// routes handlers requireing
const doctorAuthRoutes = require('./routes/doctorAuth')
const doctorRoutes = require('./routes/doctor')
const guestRoutes = require('./routes/guest')
const patientRoutes = require('./routes/patient');
const patientAuthRoutes = require('./routes/patientAuth');


//Models requireing
const Doctor = require('./models/doctor');
const Qualification = require('./models/qualification');
const Hospital = require('./models/hospital');
const Doctor_phone_number = require('./models/doctor_phone_number');
const Patient = require('./models/patient');
const Appointment = require('./models/appointment');
const AppointmentStatus = require('./models/appointment_status');

//Models relations
Qualification.belongsTo(Doctor, { constraints: true, onDelete: 'CASCADE' });
Doctor.hasMany(Qualification);

Doctor.belongsTo(Hospital, { constraints: true});
Hospital.hasMany(Doctor);

Doctor_phone_number.belongsTo(Doctor, { constraints: true,  onDelete: 'CASCADE' });
Doctor.hasMany(Doctor_phone_number);

Patient.hasMany(Appointment);
Appointment.belongsTo(Patient);
AppointmentStatus.hasMany(Appointment);
Appointment.belongsTo(AppointmentStatus);

//Handling routes
const app = express();
app.use(bodyParser.json()); // application/json

 //setteing needed headears
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use('/auth',doctorAuthRoutes)
app.use('/doctors',doctorRoutes)
app.use('/guest',guestRoutes)
app.use('/patient', patientRoutes);
app.use('/patient/auth', patientAuthRoutes);


 //Handling Throwed needed headears
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

 sequelize 
  .sync()
  //.sync({ force: true })
  .then(result => {
    app.listen(8080);
  })
  .catch(err => {
    console.log(err);
  });

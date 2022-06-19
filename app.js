const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');

// routes handlers requireing
const doctorAuthRoutes = require('./routes/doctorAuth')
const doctorRoutes = require('./routes/doctor')
const homeRoutes = require('./routes/home')
const patientRoutes = require('./routes/patient');
const patientAuthRoutes = require('./routes/patientAuth');


//Models requireing
const Doctor = require('./models/doctor');
const Qualification = require('./models/qualification');
const Hospital = require('./models/hospital');
const Patient = require('./models/patient');
const Appointment = require('./models/appointment');
const AppointmentStatus = require('./models/appointment_status');
const Review = require('./models/review');
const Doctor_available_slot = require('./models/doctor_available_slot');
const Insurance = require('./models/insurance');
const DoctorInsurance = require('./models/doctor_insurance');

//Models relations
Qualification.belongsTo(Doctor, { constraints: true, onDelete: 'CASCADE' });
Doctor.hasMany(Qualification);

Doctor.belongsTo(Hospital, { constraints: true});
Hospital.hasMany(Doctor);

Patient.belongsTo(Insurance, { constraints: true});
Insurance.hasMany(Patient);

Patient.hasMany(Appointment);
Appointment.belongsTo(Patient);

AppointmentStatus.hasMany(Appointment);
Appointment.belongsTo(AppointmentStatus);

Doctor.hasMany(Appointment);
Appointment.belongsTo(Doctor);

Patient.hasMany(Review);
Review.belongsTo(Patient);

Doctor.hasMany(Review);
Review.belongsTo(Doctor);

Doctor.hasMany(Doctor_available_slot);
Doctor_available_slot.belongsTo(Doctor);

Doctor.belongsToMany(Insurance, { through:DoctorInsurance });
Insurance.belongsToMany(Doctor, { through:DoctorInsurance });

Appointment.belongsTo(Doctor_available_slot);
Doctor_available_slot.hasMany(Appointment);

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

app.use('/doctors-auth',doctorAuthRoutes)
app.use('/patients-auth', patientAuthRoutes);

app.use('/doctors',doctorRoutes)
app.use('/home',homeRoutes)
app.use('/patient', patientRoutes);

 //Handling Throwed needed headears
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ Error_message: message, data: data });
});

 sequelize 
  .sync()
  //.sync({ force: true })
  .then(result => {
    app.listen(process.env.PORT || 8080);
  })
  .catch(err => {
    console.log(err);
  });

  // RUN FOR DEV: [npm run start:dev]
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

////used Models
const Doctor = require('../models/doctor');
const Qualification = require('../models/qualification')


exports.signup =async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())  //need to throw err properly
     {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    //extract body data
    const email = req.body.email;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const username = req.body.username;
    const password = req.body.password;
    const waiting_time = req.body.waiting_time;
    const consultaion_fee = req.body.consultaion_fee;
    const city = req.body.city;
    const region = req.body.region;
    const date_of_birth = req.body.date_of_birth;
    const specialization = req.body.specialization;
   
    try{
      //create doctor
    const hashedPw= await bcrypt.hash(password, 12)
    const createdDoctor = await Doctor.create(
          { 
            email:email,
            first_name: first_name ,
            last_name: last_name ,
            username: username ,
            password: hashedPw ,
            waiting_time: waiting_time ,
            consultaion_fee: consultaion_fee ,
            city: city ,
            region: region ,
            date_of_birth: date_of_birth ,
            specialization: specialization ,
            age: 0 })

      // add qulaificayions to the doctor if attached
        if (req.query.addQualification === "true")
        {
          
          let qulas = req.body.qualifications
          if (!qulas) {
            const error = new Error('No Added Qualifications !');
            error.statusCode = 404;
            throw error;
          }
          let qualificationsList=[]
          for (let i=0;i<req.body.qualifications.length; i++ )
          {
            let createdQualification= await Qualification.create(
              {
                qualification_name: qulas[i].qualification_name,
                institute_name: qulas[i].institute_name,
                procurement_year:qulas[i].procurement_year
              })
              qualificationsList.push(createdQualification)
          }
        const doctowithqulais= await createdDoctor.addQualifications(qualificationsList)
        }
     // send back done response
    res.status(201).json({ message: 'Doctor created!', doctor_id: createdDoctor.id });
        }
        catch(err)
         {
        if (!err.statusCode) 
        {
          err.statusCode = 500;
        }
        next(err);
        }
}


exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try{
  //compare email
  const searchedDoctor = await Doctor.findOne({
    where: {
      email: email
    }
  });
  if (!searchedDoctor) {
    const error = new Error('A Doctor with this email could not be found.');
    error.statusCode = 401;
    throw error;
  }

  //compare password
  let passEqula= bcrypt.compare(password, searchedDoctor.password);
  if (!passEqula) {
    const error = new Error('Wrong password!');
    error.statusCode = 401;
    throw error;
  }
  //creat token for 1-hour
  const createdToken = jwt.sign(
    {
      email: searchedDoctor.email,
      userId: searchedDoctor.id
    },
    'yashfy-secret-key',
    { expiresIn: '1h' }
  );
  res.status(200).json(
    { token: createdToken, userId: searchedDoctor.id });
  }
  catch(err)
  {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}


exports.getDoctor = async (req, res, next) => {
  const doctorId = parseInt(req.params.doctorId);
  try{
  const selectedDoctor = await Doctor.findOne(
    { where: {id: doctorId} })

  if (!selectedDoctor) {
    const error = new Error('Could not find Doctor.');
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ message: 'Doctor fetched.', doctor: selectedDoctor });
  }
  catch(err)
  {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}


exports.addQualificatin = async (req, res, next) => {
  let doctorId = parseInt(req.userId)
  const qualification_name = req.body.qualification_name;
  const institute_name = req.body.institute_name;
  const procurement_year = req.body.procurement_year;

  const selectedDoctor = await Doctor.findOne({ where: {id: doctorId} })
  if (!selectedDoctor) {
    const error = new Error('Could not find Doctor.');
    error.statusCode = 404;
    throw error;
  }

  let qulas = req.body.qualifications
  let qualificationsList=[]
  for (let i=0;i<req.body.qualifications.length; i++ )
  {
    let createdQualification= await Qualification.create(
      {
        qualification_name: qulas[i].qualification_name,
        institute_name: qulas[i].institute_name,
        procurement_year:qulas[i].procurement_year
      })
      qualificationsList.push(createdQualification)
  }
  const doctorWithQulaisAdded =  await selectedDoctor.addQualifications(qualificationsList)
  
      // send back done response
    res.status(201).json(
      { message: 'Qualfication aded Successfully!', doctor_id: selectedDoctor.id  });
}

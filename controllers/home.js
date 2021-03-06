////used Models
const Doctor = require('../models/doctor');
const Hospital = require('../models/hospital');
const Insurance = require('../models/insurance');

//Sequlize Lib
const { QueryTypes } = require('sequelize');
const sequelize = require('../util/database') // require initiated the connection


exports.getDoctor = async (req, res, next) => {
    const doctorId = parseInt(req.params.doctorId);
    try{
    const selectedDoctor = await Doctor.findOne(
      { where: {id: doctorId} })
  
    if (!selectedDoctor) {
      res.status(404).json({ message: 'Could not find Doctor.' });
    }

    const hospital = await Hospital.findOne(
      { where: {id: selectedDoctor.hospitalId} })
  

    res.status(200).json({ message: 'Doctor fetched.', doctor: selectedDoctor ,hospital_name:hospital.hospital_name });
    }
    catch(err)
    {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }

exports.getHospitals = async (req, res, next) => {
    try{
    const allHospitals= await Hospital.findAll()
    
    if (!allHospitals.length) {
      console.log("HERE !")

      const error = new Error('Could not find Hospitals.');
      error.statusCode = 404;
      throw error;
    }

    // YOU SHOULD CALCULATE num of doctors and specialities

    res.status(200).json({ message: 'hospitals fetched.', Hospitals: allHospitals });
    }
    catch(err)
    {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }

exports.getDoctors = async (req, res, next) =>{
  //Default Values
  let specializationParam =null
  let regionParam = null
  let cityParam = null
  let limit = 20
  console.log(req.query)
  // Taken from request
  let tempspecializationParam = req.query.specialization
  let tempregionParam = req.query.region
  let tempcityParam = req.query.city

  // If not null set with the needed filters!
  if(tempspecializationParam){
    specializationParam = tempspecializationParam
  }
  if(tempregionParam){
    regionParam = tempregionParam + "%"
  }
  if(tempcityParam){
    cityParam = tempcityParam
  }

  try{
const fetchedDoctors = await sequelize.query(
    'SELECT * FROM doctors WHERE specialization = (CASE WHEN :specializationParam IS NOT NULL THEN :specializationParam ELSE specialization END) AND region like (CASE WHEN :regionParam IS NOT NULL THEN :regionParam ELSE region END) AND city =  (CASE WHEN :cityParam IS NOT NULL THEN :cityParam ELSE city END) LIMIT :limit', {
    model: Doctor,
    mapToModel: true ,// pass true here if you have any mapped fields,
    replacements:{ specializationParam: specializationParam, regionParam: regionParam , cityParam : cityParam , limit: limit },
    type: QueryTypes.SELECT
  });


 if (!fetchedDoctors) {
  const error = new Error('Could not find Doctor.');
  error.statusCode = 404;
  throw error;
  }

  res.status(200).json({ message: 'Doctors fetched.', fetchedDoctors: fetchedDoctors });
    }
    catch(err)
    {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }

exports.getInsurances = async (req, res, next) => {
    try {
      const insurances = await Insurance.findAll()
                if(!insurances.length) {
                 return res.status(404).json({message:"No Insurances Found"})
                }
                res.status(200).json({
                  message: "Insurances:",
                  insurances: insurances
                })
      }

      catch(err)
      {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        err.message = "Internal Server Error!";
        next(err);
      }
  }

exports.getDoctorAvailableSlots = async (req, res, next) => {
  const doctorId = parseInt(req.params.doctorId);
  try {

    const retrivedSlots= await sequelize.query(
              'SELECT S.* , TIME_FORMAT(TIME(S.start_time),"%h:%i %p") as time FROM doctors D join doctor_available_slots S on D.id = S.doctorId  where S.doctorId  = :docId ', {
              type: QueryTypes.SELECT,
              replacements:{ docId: doctorId}
            })
    if(!retrivedSlots.length){
      return res.status(404).json({message: "No available slots for this doctor"})
      }
    res.status(200).json({
        message: "Available Slots:",
        slots: retrivedSlots
      })
    }      
    catch(err)
    {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      err.message = "Internal Server Error!";
      next(err);
    }
  }; 



exports.getDoctorReviews = async (req, res, next) => {
  const doctorId = parseInt(req.params.doctorId);
  try {
    const doctor = await Doctor.findByPk(doctorId);
          if(!doctor){
            return res.status(404).json({message: "Could not find such doctor!"});
            }

     const retrivedReviews = await sequelize.query(
        'SELECT R.id, R.review, R.is_review_annoymous, DATE_FORMAT(DATE(R.createdAt), "%d %M %Y") as date, TIME_FORMAT(TIME(R.createdAt),"%h:%i %p") as time, Concat(P.first_name," ",P.last_name) as patient_name FROM patients P join reviews R on P.id = R.patientId where R.doctorId = :docId', {
        type: QueryTypes.SELECT,
        replacements:{ docId: doctorId}
      });

      if(!retrivedReviews.length){
        return res.status(404).json({message: "No Reviews for this doctor"})
        }

          res.status(200).json({
              message: "Successfully Retrieved Reviews:",
              reviews: retrivedReviews
            })
    }      
    catch(err)
    {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      err.message = "Internal Server Error!";
      next(err);
    }


}
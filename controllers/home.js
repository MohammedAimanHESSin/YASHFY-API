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

exports.getHospitals = async (req, res, next) => {
    try{
    const allHospitals= await Hospital.findAll()
  
    if (!allHospitals) {
      const error = new Error('Could not find Doctor.');
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

  // Taken from request
  let tempspecializationParam = req.query.specialization
  let tempregionParam = req.query.region
  let tempcityParam = req.query.city

  // If not null set with the needed filters!
  if(tempspecializationParam){
    specializationParam = tempspecializationParam
  }
  if(tempregionParam){
    regionParam = tempregionParam
  }
  if(tempcityParam){
    cityParam = tempcityParam
  }

  try{
const fetchedDoctors = await sequelize.query(
    'SELECT * FROM doctors WHERE specialization = (CASE WHEN :specializationParam IS NOT NULL THEN :specializationParam ELSE specialization END) AND region =  (CASE WHEN :regionParam IS NOT NULL THEN :regionParam ELSE region END) AND city =  (CASE WHEN :cityParam IS NOT NULL THEN :cityParam ELSE city END)', {
    model: Doctor,
    mapToModel: true ,// pass true here if you have any mapped fields,
    replacements:{ specializationParam: specializationParam, regionParam: regionParam , cityParam : cityParam },
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
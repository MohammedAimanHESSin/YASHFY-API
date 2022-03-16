////used Models
const Doctor = require('../models/doctor');
const Hospital = require('../models/hospital');


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
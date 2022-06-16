const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

////used Models
const Doctor = require('../models/doctor');
const Qualification = require('../models/qualification')
const Hospital = require('../models/hospital');
const Appointment = require('../models/appointment');
const Doctor_available_slot = require('../models/doctor_available_slot');

exports.signup =async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())  //need to throw err properly <DONE!>
     {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      next(error)
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
    const hospital_id = req.body.hospital_id;
    const phone_number = req.body.phone_number;

   
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
            hospitalId: hospital_id,
            age: 0 })

            if (!createdDoctor) {
              const error = new Error('Cant Add Doctor  !');
              error.statusCode = 404;
              throw error;
            }

        // add Hospital to the doctor
          let qulas = req.body.qualifications
          if (!qulas ) {
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
      let finalDoctorInfo= await createdDoctor.addQualifications(qualificationsList)  
            
      // add Hospital to the doctor if attached
     
          const hospital_id = parseInt(req.body.hospital_id)
          const searchedHospital = await Hospital.findOne({
            where: {
              id: hospital_id
            }
          });
          if (searchedHospital) {
            finalDoctorInfo = await finalDoctorInfo.setHospital(searchedHospital)
          }
      
        


     // send back done response
    res.status(201).json({ message: 'Doctor created!', doctor_id: finalDoctorInfo.id });
        }
        catch(err)
         {
           err.message = " Internal Server Error"
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
  let passEqula= await bcrypt.compare(password, searchedDoctor.password);
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
   /* { expiresIn: '1h' }*/
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

exports.addQualificatin = async (req, res, next) => {
  let doctorId = parseInt(req.userId)

  const selectedDoctor = await Doctor.findOne({ where: {id: doctorId} })
  if (!selectedDoctor) {
    return res.status(404).json({message: 'Could not find doctor.'});
  }
  try{
  let qulas = req.body.qualifications
  let qualificationsList=[]
  for (let i=0;i<qulas.length; i++ )
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
      { message: 'Qualfication added successfully!', doctor_id: doctorWithQulaisAdded.id  });
    }
    catch(err)
  {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getDoctorProfile = async (req, res, next)=>{

  const doctorId = parseInt(req.userId);
  try{
  const selectedDoctor = await Doctor.findOne(
    { where: {id: doctorId} })

  if (!selectedDoctor) {
    return res.status(404).json({message: 'Could not find doctor'});
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

exports.editDoctorProfile = async (req,res,next) => {
  const doctorId = parseInt(req.userId);
  try{
    const selectedDoctor = await Doctor.findOne(
      { where: {id: doctorId} })
  
    if (!selectedDoctor) {
      return res.status(404).json({message: 'Could not find doctor'});
    }

    //extract body data
    const new_email = req.body.email;
    const new_first_name = req.body.first_name;
    const new_last_name = req.body.last_name;
    const new_username = req.body.username;
    const new_waiting_time = req.body.waiting_time;
    const new_consultaion_fee = req.body.consultaion_fee;
    const new_city = req.body.city;
    const new_region = req.body.region;
    const new_date_of_birth = req.body.date_of_birth;
    const new_specialization = req.body.specialization;

   selectedDoctor.set({
            email:new_email,
            first_name: new_first_name ,
            last_name: new_last_name ,
            username: new_username ,
            waiting_time: new_waiting_time ,
            consultaion_fee: new_consultaion_fee ,
            city: new_city ,
            region: new_region ,
            date_of_birth: new_date_of_birth ,
            specialization: new_specialization 
    });
    // update the database 
    const updatedDoctor = await selectedDoctor.save()
     // send back done response
     res.status(201).json({ message: 'Doctor Info is UPDATED !', doctor_id: updatedDoctor.id });
  }catch(err)
  {
 if (!err.statusCode) 
 {
   err.statusCode = 500;
 }
 next(err);
 }
}

exports.addPhoneNumber = async (req, res, next) => { 
  let doctorId = parseInt(req.userId)
  try{
  const selectedDoctor = await Doctor.findOne({ where: {id: doctorId} })
  if (!selectedDoctor) {
    return res.status(404).json({message: 'Could not find doctor.'});
  }
  let phone_nums = req.body.phone_nums
  let phone_numsList=[]
  for (let i=0;i<phone_nums.length; i++ )
  {
    let createdPhoneNum= await Doctor_phone_number.create(
      {
        phone_num: phone_nums[i].phone_num,
      })
      phone_numsList.push(createdPhoneNum)
  }
  const doctorWithphone_numsListAdded =  await selectedDoctor.addDoctor_phone_numbers(phone_numsList)

  
      // send back done response
    res.status(201).json(
      { message: 'Phone Nums aded Successfully!', doctor_id: doctorWithphone_numsListAdded.id  });
    }
    catch(err)
    {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
}

exports.getDoctorAppointments = async (req, res, next)=>{
  try{
    const doctor_id = parseInt(req.userId)
    selectedDoctor = await Doctor.findByPk(doctor_id)
    if (!selectedDoctor) {
      return res.status(404).json({message: 'Could not find doctor.'});
    }
    doctroAppointments = await selectedDoctor.getAppointments()
    if (!doctroAppointments.length) {
      const error = new Error('No Appointments is found.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: 'Appointments fetched.', appointments: doctroAppointments });
  }
  catch(err)
  {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.cancelDoctorAppointment = async (req, res, next)=>{

  // Should notify patient!!
  try{
    const doctor_id = parseInt(req.userId)
    const AppointmentId = parseInt(req.body.AppointmentId)

    const selectedAppointment = await Appointment.findByPk(AppointmentId)

    if (!selectedAppointment) {
      return res.status(404).json({message: 'An Appointment with this ID could not be found'});
    }

    if (selectedAppointment.doctorId !== doctor_id ) {
      return res.status(404).json({message: 'Invalid selected Appointment'});
    }

    selectedAppointment.set(
        {
          appointmentStatusId: 3 //Canceled 
        }
    )
    await selectedAppointment.save()

    // await notify patient (webSocket)

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

exports.addSlots = async (req, res, next) => {
  const doctorId = req.userId;
  let availableSlots = req.body.availableSlots;

  try {
  const doctor = await Doctor.findByPk(doctorId)
        if(!doctor){
            return res.status(404).json({message: "Could not find such doctor!"});
            }

        for(let i=0 ; i<availableSlots.length; i++) {
           const slot = await doctor.createDoctor_available_slot(availableSlots[i]);
                  if(!slot){
                  return res.status(404).json({message: "Slot is not added!"});
                  }  
          }
          res.status(200).json({message: "Slots Added Succesfully"})
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

exports.getAvailableSlots = async (req, res, next) => {
  const doctorId = req.userId;
try {
  const doctor = await Doctor.findByPk(doctorId);
  
        if(!doctor){
          return res.status(404).json({message: "Could not find such doctor!"});
          }

        const slots = await doctor.getDoctor_available_slots();      
        if(!slots.length){
          return res.status(404).json({message: "No available slots for this doctor"})
          }
        res.status(200).json({
            message: "Available Slots:",
            slots: slots
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

exports.getSingleSlot = async (req, res, next) => {
  const slotId = req.params.slotId;

  try {
  const slot = await Doctor_available_slot.findByPk(slotId)
              if(!slot) {
              return res.status(404).json({message:"Slot Not Found"})
              }
              res.status(200).json({
                message: "Slot",
                slot: slot
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

exports.editSingleSlot = async (req, res, next) => {
  const slotId = req.params.slotId;
  const updated_day_of_week = req.body.updated_day_of_week;
  const updated_start_time = req.body.updated_start_time;
  const updated_is_available = req.body.updated_is_available;

try {
  let selected_slot = await Doctor_available_slot.findByPk(slotId)
               if(!selected_slot) {
                return res.status(404).json({message:"Slot Not Found"});
                }

                // This check is not working well!

                /*if(selected_slot.day_of_week === updated_day_of_week && selected_slot.start_time === updated_start_time && selected_slot.is_available === updated_is_available ) {
                return res.status(401).json({message:"Updated data is the same as the old ones"})
                }*/

                selected_slot.day_of_week = updated_day_of_week;
                selected_slot.start_time = updated_start_time;
                selected_slot.is_available = updated_is_available;
                selected_slot = await selected_slot.save();
                if(!selected_slot) {
                return res.status(401).json({message:"Error saving slot"})
                }
                res.status(200).json({
                  message:"Slot Updated",
                  slot: selected_slot
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

exports.addSupportedInsurances = async (req, res, next) => {
  const doctorId = req.userId;
  let supportedInsurances = req.body.supportedInsurances;

  try {
  const doctor = await Doctor.findByPk(doctorId)
        if(!doctor) {
          return res.status(404).json({message: "Could not find such doctor!"});
          }

          for(let i=0; i<supportedInsurances.length; i++ ) {
            const insurance = await doctor.createInsurance(supportedInsurances[i]);
            if(!insurance) {
            return res.status(400).json({message:"Insurance not created"});
            }
          }
          res.status(200).json({message: "Insurances Added Succesfully"})
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
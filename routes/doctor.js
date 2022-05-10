const express = require('express')
const doctorController = require('../controllers/doctor')
const isAuth = require('../middleware/is-auth');

const router = express.Router();

//:  /doctors/....

router.post('/add-qualification',isAuth , doctorController.addQualificatin)

router.post('/add-phone-num',isAuth , doctorController.addPhoneNumber)

router.post('/addSlots',isAuth , doctorController.addSlots);

router.get('/slots',isAuth , doctorController.getAvailableSlots);

router.get('/slot/:slotId',isAuth , doctorController.getSingleSlot);

router.patch('/slot/:slotId',isAuth , doctorController.editSingleSlot);

router.post('/addSupportedInsurances',isAuth , doctorController.addSupportedInsurances);

router.get('/profile',isAuth , doctorController.getDoctorProfile)

router.patch('/edit-profile',isAuth , doctorController.editDoctorProfile)

router.get('/my-appointments',isAuth , doctorController.getDoctorAppointments)

router.patch('/cancel-appointment',isAuth , doctorController.cancelDoctorAppointment)




module.exports = router;


const express = require('express')
const doctorController = require('../controllers/doctor')
const isAuth = require('../middleware/is-auth');

const router = express.Router();

//:  /doctors/....

router.post('/add-qualification',isAuth , doctorController.addQualificatin)

router.post('/add-phone-num',isAuth , doctorController.addPhoneNumber)

router.get('/profile',isAuth , doctorController.getDoctorProfile)

router.patch('/edit-profile',isAuth , doctorController.editDoctorProfile)




module.exports = router;


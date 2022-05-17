const express = require('express')
const homeController = require('../controllers/home')
const router = express.Router();

// ALL ROUTES HERE START WITH  ->    /home/...

router.get('/doctors/:doctorId', homeController.getDoctor)

router.get('/doctors/:doctorId/available-slots', homeController.getDoctorAvailableSlots)

router.get('/doctors/:doctorId/reviews', homeController.getDoctorReviews)

router.get('/hospitals', homeController.getHospitals)

router.get('/doctors', homeController.getDoctors)

router.get('/insurances', homeController.getInsurances);



module.exports = router;

const express = require('express')
const homeController = require('../controllers/home')
const router = express.Router();

router.get('/doctors/:doctorId', homeController.getDoctor)

router.get('/hospitals', homeController.getHospitals)

router.get('/doctors', homeController.getDoctors)

module.exports = router;
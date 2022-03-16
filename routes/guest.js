const express = require('express')
const guestController = require('../controllers/guest')
const router = express.Router();

router.get('/doctors/:doctorId', guestController.getDoctor)

router.get('/hospitals', guestController.getHospitals)


module.exports = router;

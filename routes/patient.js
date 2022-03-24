const express = require('express');

const router = express.Router();

const patientController = require('../controllers/patient');

const isAuth = require('../middleware/is-auth');


router.get('/profile', isAuth, patientController.getProfile);

router.patch('/profile', isAuth, patientController.updateProfile);

router.post('/bookAppointment', isAuth, patientController.bookAppointment);

router.get('/appointments', isAuth, patientController.getAppointments);

module.exports = router;
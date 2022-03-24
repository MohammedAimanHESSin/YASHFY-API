const express = require('express');

const { body } = require('express-validator/check');

const router = express.Router();

const Patient = require('../models/patient');
const patientController = require('../controllers/patient');

router.put('/patient-signup', [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value, { req  }) => {
        return Patient.findOne({ email: value }).then(patient => {
            if(patient){
                return Promise.reject('E-mail address already exists');
            }
        });
    })
    .normalizeEmail(),
    body('password').trim()
                    .isLength({min: 8}),
    body('username').trim()
                    .not()
                    .isEmpty()
    ],
        patientController.addPatient
);

router.post('/patient-login', patientController.patientLogin);

module.exports = router;
const express = require('express');
const { body } = require('express-validator/check');

//used Models
const Doctor = require('../models/doctor')

//Attached Controllers
const doctorController = require('../controllers/doctor');


const router = express.Router();

router.put('/doctor-signup',[
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return Doctor.findOne({ where: { email: value} })
        .then(findedDoctor => {
          if (findedDoctor) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 8 }),
    body('username')
      .trim()
      .not()
      .isEmpty()
  ], doctorController.signup)

router.post('/doctor-login', doctorController.login);


module.exports = router;

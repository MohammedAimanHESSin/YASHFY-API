const express = require('express')
const doctorController = require('../controllers/doctor')
const isAuth = require('../middleware/is-auth');

const router = express.Router();

//GET: /

router.post('/add-qualification',isAuth , doctorController.addQualificatin)

router.get('/:doctorId', doctorController.getDoctor)


module.exports = router;


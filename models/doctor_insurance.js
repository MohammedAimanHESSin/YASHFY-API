const Sequelize = require('sequelize')

const sequelize = require('../util/database');


const DoctorInsurance = sequelize.define('doctor_insurance', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    }, 
} 
);

module.exports = DoctorInsurance;
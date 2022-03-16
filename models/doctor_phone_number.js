const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const Doctor_phone_number = sequelize.define('doctor_phone_number', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    phone_num: Sequelize.STRING
  });
  
  module.exports = Doctor_phone_number;
  
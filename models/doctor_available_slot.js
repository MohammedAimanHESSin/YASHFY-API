const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Doctor_available_slot = sequelize.define('doctor_available_slot', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    day_of_week: {
      type:  Sequelize.STRING,
     // primaryKey: true
    },
    start_time: {
      type: Sequelize.TIME,
      //primaryKey: true
    }, 
    is_available: Sequelize.BOOLEAN,
});

module.exports = Doctor_available_slot;
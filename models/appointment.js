const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Appointment = sequelize.define('appointment', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    start_time: {
      type: 'TIMESTAMP',
      
    },
    appointment_date: Sequelize.DATE,
});

module.exports = Appointment;
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const AppointmentStatus = sequelize.define('appointment_status', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    status: Sequelize.STRING
});

module.exports = AppointmentStatus;
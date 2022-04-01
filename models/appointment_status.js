const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const AppointmentStatus = sequelize.define('appointment_status', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    states: {
      type: Sequelize.ENUM,
      values: ['active', 'complete', 'canceled']
    } } ,{ timestamps: false });

module.exports = AppointmentStatus;
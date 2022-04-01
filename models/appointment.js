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
      type:Sequelize.TIME, 
    },
    appointment_date: Sequelize.DATEONLY  ,
}
,{
  indexes: [
      {
          unique: true,
          fields: ['start_time', 'appointment_date', 'doctorID']
      }
  ]
}


);

module.exports = Appointment;
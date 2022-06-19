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
    day_of_week:{
      type: Sequelize.ENUM,
      values: ['Saturday', 'Sunday', 'Monday' ,'Tuesday','Wednesday','Thursday','Friday']
    }  , 

}
,{
  indexes: [
      {
          unique: true,
          fields: ['start_time', 'day_of_week', 'doctorID']
      }
  ]
}


);

module.exports = Appointment;
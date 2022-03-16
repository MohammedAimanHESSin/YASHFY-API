const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const Hospital = sequelize.define('hospital', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    hospital_name: Sequelize.STRING,
    doctors_num: Sequelize.INTEGER,
    specialities_num: Sequelize.INTEGER
  });
  
  module.exports = Hospital;
  